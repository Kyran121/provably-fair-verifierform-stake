<script lang="ts">
  import { fadeFlyScale } from '$lib/transition';
  import { fade } from 'svelte/transition';
  import { Input, type Control } from 'provably-fair-verifierform-lib';
  import { z } from 'zod';
  import { BTN_BG_COLOR } from '$lib/constants';
  import { goto } from '$app/navigation';

  let betid: string | undefined = $state();
  let betidError: string | undefined = $state();
  let inprogress = $state(false);

  const schema = z.object({
    betid: z.string().superRefine((val, ctx) => {
      const isDigits = /^\d+$/.test(val);
      const isCasino = /^casino:\d+$/.test(val);
      const isHouse = /^house:\d+$/.test(val);

      if (isDigits || isCasino || isHouse) return;

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must be digits or 'casino:<digits>' or 'house:<digits>'"
      });
    })
  });

  let validationResult = $derived.by(() => {
    if (betid === null || betid === '') {
      return schema?.safeParse({});
    }
    return schema?.safeParse({ betid });
  });

  let validationErrors = $derived.by(() => {
    if (!validationResult || validationResult.success) return {};
    return validationResult.error.flatten().fieldErrors;
  });

  let formValid = $derived(validationResult?.success === true);

  const control: Control = {
    id: 'betid',
    name: 'betid',
    label: 'Bet ID',
    type: 'text',
    required: true
  };

  function lookupBet() {
    inprogress = true;

    fetch(`http://localhost:3000/bet?id=${betid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorResponse = await response.json();
          betidError = errorResponse.error;
          inprogress = false;
          return;
        }

        const data = await response.json();

        // goto state
        goto(`?${new URLSearchParams(data).toString()}`);

        inprogress = false;

        // close modal
        onClose();
      })
      .catch((error) => {
        console.error('bet lookup error:', error);
      });
  }

  const { onClose } = $props();
</script>

<div>
  <div class="relative z-10" aria-labelledby="dialog-title" role="dialog" aria-modal="true">
    <div
      class="fixed inset-0 bg-gray-500/75 transition-opacity"
      aria-hidden="true"
      in:fade={{ duration: 300 }}
      out:fade={{ duration: 200 }}
    ></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div
        class="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          class="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg dark:bg-gray-800"
          in:fadeFlyScale={{ duration: 300 }}
          out:fadeFlyScale={{ duration: 200 }}
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-800">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10"
              >
                <svg
                  class="size-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <div class="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white" id="dialog-title">
                  Lookup Bet
                </h3>
                <div class="mt-2">
                  <Input
                    {control}
                    bind:value={betid as string}
                    error={validationErrors.betid?.[0] || betidError}
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-900">
            <button
              type="button"
              class={[
                'inline-flex w-full justify-center px-3 py-2 text-sm font-semibold text-white sm:ml-3 sm:w-auto',
                !formValid ? 'cursor-not-allowed bg-purple-500 opacity-75' : BTN_BG_COLOR
              ]}
              {...!formValid && { disabled: true }}
              disabled={inprogress}
              onclick={lookupBet}>{inprogress ? 'Looking...' : 'Lookup'}</button
            >
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:border-white dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              onclick={onClose}>Close</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
