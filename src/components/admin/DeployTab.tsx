/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function DeployTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans">
      {/* Environment Variables */}
      <div className="border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 p-6 sm:p-8 rounded-2xl space-y-5">
        <h3 className="font-sans font-extrabold text-base text-zinc-900 dark:text-zinc-50 pb-3 border-b border-zinc-200 dark:border-zinc-800">
          Environment Variables Matrix
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          When deploying to Netlify, Vercel, or Cloud Run, declare these environment variables in your platform settings:
        </p>
        <div className="p-4 rounded-xl bg-zinc-950 text-amber-500 border border-zinc-900 font-mono text-[10px] space-y-2.5">
          <div className="text-zinc-500"># PRODUCTION</div>
          <div>VITE_APP_URL="https://elvitigala-civil.lk"</div>
          <div className="pt-2 text-zinc-500"># SUPABASE</div>
          <div>VITE_SUPABASE_URL="https://your-app-id.supabase.co"</div>
          <div>VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5..."</div>
          <div className="pt-2 text-zinc-500"># EMAIL</div>
          <div>SMTP_CONTACT_NOTIFY="sales@elvitigala.lk"</div>
        </div>
      </div>

      {/* GitHub Actions */}
      <div className="border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 p-6 sm:p-8 rounded-2xl space-y-5">
        <h3 className="font-sans font-extrabold text-base text-zinc-900 dark:text-zinc-50 pb-3 border-b border-zinc-200 dark:border-zinc-800">
          CI/CD Pipeline (GitHub Actions)
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Add this to <code className="font-mono text-amber-500">.github/workflows/deploy.yml</code> to auto-deploy on push to <code className="font-mono text-amber-500">main</code>:
        </p>
        <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-300 border border-zinc-900 font-mono text-[10px] overflow-x-auto max-h-[220px]">
          {`name: Deploy Elvitigala Project
on:
  push:
    branches: [ main ]
jobs:
  build_prod:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Build static files
        run: npm run build
        env:
          VITE_SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: \${{ secrets.SUPABASE_ANON_KEY }}
      - name: Deploy to Cloud Run
        run: echo "Deploying..."`}
        </pre>
      </div>
    </div>
  );
}