/**
 * Script to generate comprehensive Moles test cases from Stake's calculation page
 *
 * Run in browser console on Stake's calculation page:
 * https://stake.com/provably-fair/calculation?game=moles
 *
 * Usage:
 * 1. Open the calculation page for Moles
 * 2. Set clientSeed and serverSeed (the script will iterate through nonces and mole counts)
 * 3. Run this script in the browser console: await generateAllMolesTestCases()
 * 4. Copy the output and add to your test file
 */

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function extractMolesTestCase() {
  // Extract input values using test-ids
  const clientSeedInput = document.querySelector('[data-testid="calculation-input-clientSeed"]');
  const serverSeedInput = document.querySelector('[data-testid="calculation-input-serverSeed"]');
  const nonceInput = document.querySelector('[data-testid="calculation-input-nonce"]');
  const molesSelect = document.querySelector('[data-testid="calculation-select-molesCount"]');

  if (!clientSeedInput || !serverSeedInput || !nonceInput || !molesSelect) {
    console.error('Could not find input fields. Make sure you are on the Moles calculation page.');
    return null;
  }

  const clientSeed = clientSeedInput.value;
  const serverSeed = serverSeedInput.value;
  const nonce = parseInt(nonceInput.value, 10);
  const molesCount = parseInt(molesSelect.value, 10);

  // Wait a bit for the calculation to complete
  await sleep(300);

  // Extract the final result from the "Values:" paragraph
  const resultParagraph = Array.from(document.querySelectorAll('p')).find(p =>
    p.textContent.includes('Values: [[')
  );

  if (!resultParagraph) {
    console.error('Could not find result paragraph. Make sure the calculation has loaded.');
    return null;
  }

  // Extract the array from the text like "Values: [[6],[6],[1],[5],[3],[1],[6],[3]]"
  const match = resultParagraph.textContent.match(/Values: (\[\[.*?\]\])/);
  if (!match) {
    console.error('Could not parse result from:', resultParagraph.textContent);
    return null;
  }

  const resultArray = JSON.parse(match[1]);

  return {
    clientSeed,
    serverSeed,
    nonce,
    molesCount,
    result: resultArray
  };
}

async function setInputValue(selector, value) {
  const input = document.querySelector(selector);
  if (!input) {
    console.error('Could not find input:', selector);
    return false;
  }

  // Trigger proper events for React/Svelte to detect changes
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));

  await sleep(100);
  return true;
}

async function generateAllMolesTestCases(noncesPerMoleCount = 5) {
  console.log('Starting test case generation...\n');

  const testCases = [];
  const moleCounts = [1, 2, 3, 4, 5, 6];

  for (const molesCount of moleCounts) {
    console.log(`Generating test cases for ${molesCount} mole(s)...`);

    // Set the moles count
    await setInputValue('[data-testid="calculation-select-molesCount"]', molesCount);

    for (let nonce = 0; nonce < noncesPerMoleCount; nonce++) {
      // Set the nonce
      await setInputValue('[data-testid="calculation-input-nonce"]', nonce);

      // Extract the test case
      const testCase = await extractMolesTestCase();

      if (testCase) {
        testCases.push(testCase);
        console.log(`  ✓ Nonce ${nonce}: ${JSON.stringify(testCase.result)}`);
      } else {
        console.error(`  ✗ Failed to extract test case for nonce ${nonce}`);
      }
    }
  }

  console.log(`\n=== Generated ${testCases.length} Test Cases ===\n`);

  // Build the output as a single string
  let output = 'it.each([\n';
  testCases.forEach((tc, index) => {
    const resultString = JSON.stringify(tc.result);
    output += `  [\n`;
    output += `    '${tc.clientSeed}',\n`;
    output += `    '${tc.serverSeed}',\n`;
    output += `    ${tc.nonce},\n`;
    output += `    ${tc.molesCount},\n`;
    output += `    ${resultString}\n`;
    output += `  ]${index < testCases.length - 1 ? ',' : ''}\n`;
  });
  output += '])(\n';
  output += `  'renders the correct results (clientseed=%s, serverseed=%s, nonce=%s, molesCount=%s)',\n`;
  output += `  async (clientseed, serverseed, nonce, molesCount, expectedResult) => {\n`;
  output += `    const formValues = {\n`;
  output += `      nonce,\n`;
  output += `      clientseed,\n`;
  output += `      serverseed,\n`;
  output += `      molesCount,\n`;
  output += `      game: 'moles'\n`;
  output += `    } as Record<string, unknown>;\n\n`;
  output += `    const screen = render(MolesResult, { formValues });\n`;
  output += `    vi.advanceTimersByTime(350);\n`;
  output += `    // TODO: Add assertion to check expectedResult matches rendered output\n`;
  output += `  }\n`;
  output += `);\n`;

  // Store the output in a global variable for easy access
  window.molesTestCases = output;

  console.log('\n✓ Test code generated!');
  console.log(`Generated ${testCases.length} test cases total.\n`);
  console.log('To copy the code, run one of these commands:\n');
  console.log('1. Copy to clipboard (recommended):');
  console.log('   copy(window.molesTestCases)\n');
  console.log('2. View in console:');
  console.log('   console.log(window.molesTestCases)\n');

  return testCases;
}

// Instructions
console.log('=== Moles Test Case Generator ===');
console.log('To generate test cases, run:');
console.log('  await generateAllMolesTestCases(5)');
console.log('\nWhere 5 is the number of nonces to test per mole count.');
console.log('This will generate test cases for all mole counts (1-6) with the specified number of nonces each.');
