$ErrorActionPreference = "Stop"

Write-Host "Deploying Next.js frontend to Cloud Run..."
gcloud run deploy serviceapotheke-web --source . --region europe-west1 --project gen-lang-client-0493260544 --set-build-env-vars=NEXT_PUBLIC_API_URL=https://serviceapotheke-api-830781040278.europe-west1.run.app --set-env-vars=NEXT_PUBLIC_API_URL=https://serviceapotheke-api-830781040278.europe-west1.run.app --quiet
Write-Host "DONE"
