const fetch = require('node-fetch');

async function run() {
  console.log("1. Registering test pharmacist...");
  const email = `test.pharmacist.${Date.now()}@example.com`;
  const regRes = await fetch("https://api.serviceapotheke.tech/api/Pharmacist/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "E2E Tester",
      email: email,
      password: "Password123!",
      street: "Teststr",
      houseNumber: "1",
      postalCode: "10115",
      city: "Berlin"
    })
  });
  const regData = await regRes.json();
  
  console.log("2. Logging in...");
  const loginRes = await fetch("https://api.serviceapotheke.tech/api/Pharmacist/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: "Password123!" })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  const pharmacistId = loginData.pharmacist.id;
  
  console.log("3. Fetching available jobs...");
  const jobsRes = await fetch("https://api.serviceapotheke.tech/api/Job/available", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const jobs = await jobsRes.json();
  
  // Pick the first job
  const job = jobs[0];
  console.log(`Picked Job ID ${job.id} (Pharmacy ID ${job.pharmacyId})`);
  console.log(`Initial hasApplied state: ${job.hasApplied}`);
  
  console.log("4. Applying for job...");
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
  } else {
    console.log(`Apply FAILED (${applyRes.status})`);
  }
  
  console.log("5. Refetching available jobs (simulating page refresh)...");
  const jobsRes2 = await fetch("https://api.serviceapotheke.tech/api/Job/available", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const jobs2 = await jobsRes2.json();
  const jobAfter = jobs2.find(j => j.id === job.id);
  console.log(`After refetch, hasApplied state is: ${jobAfter.hasApplied}`);
  
  console.log("6. Checking Vakanzen endpoint for the pharmacy...");
  const pharmRes = await fetch(`https://api.serviceapotheke.tech/api/Job/pharmacy/${job.pharmacyId}`, {
    headers: { "Authorization": `Bearer ${token}` } // API allows any logged in user to fetch this currently
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
