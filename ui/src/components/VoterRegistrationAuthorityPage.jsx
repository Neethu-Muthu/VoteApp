import React, { useState } from "react";


const VoterRegistrationAuthorityPage = () => {
  const [candidateId, setCandidateId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [electionId, setElectionId] = useState("");
  const [message, setMessage] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(""); // For verification status
  const [showVerificationForm, setShowVerificationForm] = useState(false); // Toggle verification form

  const [showForm, setShowForm] = useState(false);
  const [candidateData, setCandidateData] = useState(null);
  const [showCandidateIdInput, setShowCandidateIdInput] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [statusMessage, setStatusMessage] = useState("");
   
  

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);
  const openCandidateIdInput = () => setShowCandidateIdInput(true);
  const closeCandidateIdInput = () => setShowCandidateIdInput(false);
  const openVerificationForm = () => setShowVerificationForm(true);
  const closeVerificationForm = () => setShowVerificationForm(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const submitForm = (e) => {
    e.preventDefault();

    const newCandidate = {
      candidateId,
      candidateName,
      electionId,
    };

    CandidateRegistration(newCandidate);
  };

  const CandidateRegistration = async (newCandidate) => {
    try {
      const res = await fetch("/api/register-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCandidate),
      });

      const result = await res.json();

      if (result.success) {
        setMessage(`Success: ${result.message}`);
        setCandidateId("");
        setCandidateName("");
        setElectionId("");
        closeForm();
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Request error:", error);
      setMessage("An error occurred while registration.");
    }
  };

  // Function to fetch election data based on electionId
  const fetchCandidateData = async (id) => {
    try {
      const res = await fetch("/api/read-candidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ candidateId: id }),
      });

      const result = await res.json();
      if (result.success) {
        setCandidateData(result.data.value);
        closeCandidateIdInput();
      } else {
        setMessage("Data not found.");
      }
    } catch (error) {
      console.error("Request error:", error);
      setMessage("An error occurred while fetching data.");
    }
  };

  // Verification function
  const verifyCandidate = async (e) => {
    e.preventDefault();

    const verificationData = {
      candidateId,
      electionId,
      verificationStatus,
    };

    try {
      const res = await fetch("/api/verify-candidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verificationData),
      });

      const result = await res.json();

      if (result.success) {
        setMessage(`Success: ${result.message}`);
        setVerificationStatus("");
        closeVerificationForm();
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Request error:", error);
      setMessage("An error occurred during verification.");
    }
  };




  const handleCompleteVerification = async () => {
    if (!electionId) {
      setError("Election ID is required");
      setMessage("");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/complete-candidate-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ electionId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError("");
      } else {
        setError(data.message || "An error occurred");
        setMessage("");
      }
    } catch (err) {
      setError("Failed to complete candidate verification");
      setMessage("");
      console.error(err);
    }
  };





 


  return (
    <>
      <section className="bg-white flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mt-10 mb-6">
          Voter Registration Authority Dashboard
        </h1>

        <div className="flex space-x-4 mb-10">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={openForm}
          >
            Register Candidate
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={openCandidateIdInput}
          >
            Get Candidate Data
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            onClick={openVerificationForm}
          >
            Verify Candidate
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleCompleteVerification(electionId)} // Pass the electionId here
          >
            Complete Verification
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.startsWith("Success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
        <div>
          <h2>Complete Candidate Verification</h2>
          <div>
            <label htmlFor="electionId">Election ID:</label>
            <input
              type="text"
              id="electionId"
              value={electionId}
              onChange={(e) => setElectionId(e.target.value)}
              placeholder="Enter Election ID"
            />
          </div>
          <button onClick={handleCompleteVerification}>
            Complete Verification
          </button>
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
              <h2 className="text-2xl font-semibold text-center mb-6">
                regsiter Candidate
              </h2>
              <form onSubmit={submitForm}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Candidate Id
                  </label>
                  <input
                    type="text"
                    className="border rounded w-full py-2 px-3"
                    placeholder="eg. Election-01"
                    required
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    className="border rounded w-full py-2 px-3"
                    placeholder="eg. Commissioner Name"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Election Id
                  </label>
                  <input
                    type="text"
                    className="border rounded w-full py-2 px-3"
                    placeholder="eg. Election 2024"
                    required
                    value={electionId}
                    onChange={(e) => setElectionId(e.target.value)}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Election ID Input Box */}
        {showCandidateIdInput && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Enter Candidate ID
              </h2>
              <input
                type="text"
                className="border rounded w-full py-2 px-3 mb-4"
                placeholder="eg. Election-01"
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={closeCandidateIdInput}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => fetchCandidateData(candidateId)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Fetch Data
                </button>
              </div>
            </div>
          </div>
        )}

        {candidateData && (
          <div className="mt-10 p-4 border rounded shadow max-w-xl w-full">
            <h3 className="text-2xl font-semibold mb-4">Candidate Data</h3>
            <div>
              <p>
                <strong>Candidate Id:</strong> {candidateData.candidateId}
              </p>
              <p>
                <strong>Candidate Name:</strong> {candidateData.candidateName}
              </p>
              <p>
                <strong>Election ID:</strong> {candidateData.electionId}
              </p>

              <p>
                <strong>Status:</strong> {candidateData.status}
              </p>
            </div>
          </div>
        )}

        {showVerificationForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Verify Candidate
              </h2>
              <form onSubmit={verifyCandidate}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Candidate Id
                  </label>
                  <input
                    type="text"
                    className="border rounded w-full py-2 px-3"
                    placeholder="eg. Candidate-01"
                    required
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Election Id
                  </label>
                  <input
                    type="text"
                    className="border rounded w-full py-2 px-3"
                    placeholder="eg. Election-2024"
                    required
                    value={electionId}
                    onChange={(e) => setElectionId(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Verification Status
                  </label>
                  <select
                    className="border rounded w-full py-2 px-3"
                    required
                    value={verificationStatus}
                    onChange={(e) => setVerificationStatus(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={closeVerificationForm}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Verify
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default VoterRegistrationAuthorityPage;
