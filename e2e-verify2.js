const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

// The hardcoded secret from the backend C# code
const secret = "EIN_LANGER_GEHEIMER_SCHLUESSEL_MIT_MINDESTENS_32_ZEICHEN";
const pharmacistId = 32;

// Forge a token for Pharmacist 1
const token = jwt.sign(
  {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "test@test.com",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Pharmacist",
    id: pharmacistId.toString(),
    SessionVersion: "1"
  },
  secret,
  {
    expiresIn: '2h',
    issuer: 'ServiceApotheke.API',
    audience: 'ServiceApotheke.Clients',
    // C# uses HMACSHA256, which maps to HS256 in Node jsonwebtoken
    algorithm: 'HS256'
  }
);

async function run() {
  console.log("1. Forged JWT token for Pharmacist 1");
  
  console.log("2. Fetching available jobs...");
  const jobsRes = await fetch("https://api.serviceapotheke.tech/api/Job/available", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (jobsRes.status !== 200) {
      console.log("Failed to fetch jobs: " + jobsRes.status);
      console.log(await jobsRes.text());
      return;
  }
  const jobs = await jobsRes.json();
  
  // Find a job we haven't applied to yet
  const job = jobs.find(j => j.hasApplied === false);
  if (!job) {
    console.log("All jobs already applied to! Test needs a new job.");
    return;
  }
  console.log(`Picked Job ID ${job.id} (Pharmacy ID ${job.pharmacyId})`);
  console.log(`Initial hasApplied state: ${job.hasApplied}`);
  
  console.log("3. Applying for job...");
  const applyRes = await fetch(`https://api.serviceapotheke.tech/api/Allocation/${job.id}/apply`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ pharmacistId })
  });
  if (applyRes.status === 200) {
    console.log("Apply SUCCESS (200 OK)");
  } else if (applyRes.status === 403) {
      console.log("Apply FAILED (403 Forbidden). KYC verification issue.");
      console.log(await applyRes.text());
      return;
  } else {
    console.log(`Apply FAILED (${applyRes.status})`);
    console.log(await applyRes.text());
    return;
  }
  
  console.log("4. Refetching available jobs (simulating page refresh)...");
  const jobsRes2 = await fetch("https://api.serviceapotheke.tech/api/Job/available", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const jobs2 = await jobsRes2.json();
  const jobAfter = jobs2.find(j => j.id === job.id);
  console.log(`After refetch, hasApplied state is: ${jobAfter.hasApplied}`);
  
  console.log("5. Checking Vakanzen endpoint for the pharmacy...");
  const pharmRes = await fetch(`https://api.serviceapotheke.tech/api/Job/pharmacy/${job.pharmacyId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const pharmJobs = await pharmRes.json();
  const pharmJob = pharmJobs.find(j => j.id === job.id);
  
  console.log(`Applications array exists? ${!!pharmJob.jobApplications}`);
  console.log(`Number of applications: ${pharmJob.jobApplications?.length}`);
  
  if (pharmJob.jobApplications?.length > 0) {
    console.log(`Pharmacist ID in application: ${pharmJob.jobApplications[0].pharmacistId}`);
  }
}

run().catch(console.error);
