#!/usr/bin/env tsx

import { config } from 'dotenv'

// Load environment variables
config()

async function testPostHogIntegration() {
  console.log('🧪 Testing PostHog Integration...\n')

  // Check environment variables
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

  console.log('📋 Environment Variables:')
  console.log(`  NEXT_PUBLIC_POSTHOG_KEY: ${posthogKey ? '✅ Set' : '❌ Missing'}`)
  console.log(`  NEXT_PUBLIC_POSTHOG_HOST: ${posthogHost ? '✅ Set' : '❌ Missing'}`)

  if (!posthogKey) {
    console.log('\n❌ NEXT_PUBLIC_POSTHOG_KEY is required for PostHog integration')
    console.log('   Add it to your .env.local file:')
    console.log('   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key')
    process.exit(1)
  }

  // Check if required files exist
  const fs = require('fs')
  const path = require('path')

  const requiredFiles = [
    'instrumentation-client.ts',
    'instrumentation.ts',
    'src/lib/posthog.ts',
    'src/lib/use-posthog.ts'
  ]

  console.log('\n📁 Required Files:')
  for (const file of requiredFiles) {
    const exists = fs.existsSync(path.join(process.cwd(), file))
    console.log(`  ${file}: ${exists ? '✅ Exists' : '❌ Missing'}`)
  }

  // Check next.config.ts
  const nextConfigPath = path.join(process.cwd(), 'next.config.ts')
  const nextConfigExists = fs.existsSync(nextConfigPath)
  console.log(`  next.config.ts: ${nextConfigExists ? '✅ Exists' : '❌ Missing'}`)

  if (nextConfigExists) {
    const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8')
    const hasInstrumentation = nextConfigContent.includes('clientInstrumentationHook')
    console.log(`  clientInstrumentationHook: ${hasInstrumentation ? '✅ Enabled' : '❌ Not enabled'}`)
  }

  // Check package.json for posthog-js dependency
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJsonExists = fs.existsSync(packageJsonPath)
  
  if (packageJsonExists) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    const hasPostHog = packageJson.dependencies && packageJson.dependencies['posthog-js']
    console.log(`  posthog-js dependency: ${hasPostHog ? '✅ Installed' : '❌ Not installed'}`)
  }

  console.log('\n✅ PostHog Integration Test Complete!')
  console.log('\n📝 Next Steps:')
  console.log('1. Start your development server: npm run dev')
  console.log('2. Open your app in the browser')
  console.log('3. Check your PostHog dashboard for incoming events')
  console.log('4. Use the PostHog debugger to see events in real-time')
  console.log('5. Test the example component: src/components/PostHogExample.tsx')
}

testPostHogIntegration().catch(console.error) 