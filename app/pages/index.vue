<script lang="ts" setup>
import type { NuxtTimeProps } from '#app'

type HourCycle = 'h11' | 'h12' | 'h23' | 'h24'

const datetime = ref(new Date())
function updateDatetime(){
  datetime.value = new Date()
  requestAnimationFrame(updateDatetime)
}
requestAnimationFrame(updateDatetime)
const relative = ref(false)
const locale = ref(navigator.language)
const options = reactive<Partial<NuxtTimeProps>>({
  calendar: 'gregory',
  numberingSystem: 'native',
  hourCycle: 'h23' as HourCycle,
  timeZone: 'UTC',
  weekday: 'long',
  era: 'long',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  dayPeriod: 'long',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZoneName: 'long',
})

watch(locale, (newVal)=>{
  sessionStorage.setItem('locale', newVal)
})

onMounted(()=>{
  try {
    const loc = sessionStorage.getItem('locale') ?? navigator.language
    new Intl.Locale(loc)
    locale.value = loc
  } catch (e) {
    sessionStorage.setItem('locale', navigator.language)
  }
})


const NUMBER_ITEMS = ['native', 'traditio', 'finance'].concat(Intl.supportedValuesOf('numberingSystem'))
const TIME_ZONES = Intl.supportedValuesOf('timeZone')

const inputLocale = ref('')
const localeInputFocus = ref(false)
const isInputLocaleValid = ref(false)

function isLocaleValid(locale: Intl.Locale) {
  return locale.maximize().region !== undefined
}

// only update actual locale value when input is valid, otherwise ignore.
function updateInputLocaleCode(value: string){
  if (!value) return
  try {
    const loc = new Intl.Locale(value)
    isInputLocaleValid.value = isLocaleValid(loc)
    if (isInputLocaleValid.value) {
      inputLocale.value = value
    }
  } catch (e) {
    isInputLocaleValid.value = false
    return
  }
}

const possibleValues = computed(()=>{
  if(!isInputLocaleValid.value) {
    return [locale.value, ...navigator.languages]
  }
  const loc = new Intl.Locale(inputLocale.value)
  return [...new Set([loc.baseName, loc.maximize().baseName, ...navigator.languages])]
})

const jsonExport = computed(()=>{
  return JSON.stringify({
    locale: locale.value,
    ...options,
  },null, 2)
})
</script>

<template>
  <div class="flex flex-col max-h-dvh">
    <div class="my-20 text-center text-4xl">
      <NuxtTime :datetime :relative :locale v-bind="options" />
    </div>
    <div class="my-4 text-center text-2xl text-red-400 md:hidden">
      Please open in desktop (mode) for best experience.
    </div>
    <div class="flex flex-row items-stretch justify-center overflow-y-auto gap-4">
      <div class="flex flex-col gap-4">
        <div class="flex flex-row justify-between">
          <UModal title="JSON export">
            <UButton class="self-start" color="secondary">Export to JSON</UButton>
            <template #body>
              <UTextarea class="w-full" :rows="12" v-model="jsonExport" variant="soft" readonly/>
            </template>
          </UModal>
          <UModal title="About">
            <UButton class="self-start" variant="link" color="neutral" icon="i-lucide:circle-help">About</UButton>
            <template #body>
              <p>
                This website is a tool that helps you configure options of `DateTimeFomat`. 
                A detailed explanation of each option is available on 
                <ULink to="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat" target="_blank" active>MDN</ULink>.
              </p>
              <br>
              <p>
                The website is built with <ULink to="https://nuxt.com/" active>Nuxt</ULink> and <ULink to="https://ui.nuxt.com/" active>Nuxt UI</ULink>, 
                you can find its source code <ULink to="https://github.com/UnluckyNinja/date-format" active>here</ULink>.
              </p>
            </template>
          </UModal>
        </div>
        <UFormField label="Locale">
          <UInputMenu class=""
            v-model="locale"
            :icon="localeInputFocus ? isInputLocaleValid ? 'i-lucide-check' : 'i-lucide-x' : 'i-lucide-text-cursor'"
            @focus="localeInputFocus = true" 
            @focusout="localeInputFocus = false" 
            @update:search-term="updateInputLocaleCode" 
            :items="possibleValues"
            ignoreFilter />
        </UFormField>
        <UFormField label="Calendar">
          <USelectMenu class="w-full" v-model="options.calendar" :items="Intl.supportedValuesOf('calendar')" />
        </UFormField>
        <UFormField label="Numbering System">
          <USelectMenu class="w-full" v-model="options.numberingSystem" :items="NUMBER_ITEMS"/>
        </UFormField>
        <UFormField label="Time Zone">
          <UInputMenu class="w-full" v-model="options.timeZone" :items="TIME_ZONES"/>
        </UFormField>
        <URadioGroup v-model="options.timeZoneName" legend="Time Zone Name" :items="[{ label: 'undefined', ui: {label: 'text-purple-500'}, value: undefined }, 'long', 'short', 'shortOffset', 'longOffset', 'shortGeneric', 'longGeneric']" />
      </div>
      <div class="mx-8 flex flex-col justify-around gap-4">
        <div class="flex gap-8">
          <URadioGroup v-model="options.era" legend="Era" :items="[{ label: 'undefined', ui: {label: 'text-purple-500'}, value: undefined }, 'long','short','narrow']" />
          <URadioGroup v-model="options.year" legend="Year" :items="[{ label: 'undefined', ui: {label: 'text-purple-500'}, value: undefined }, 'numeric','2-digit']" />
          <URadioGroup v-model="options.month" legend="Month" :items="[{ label: 'undefined', ui: {label: 'text-purple-500'}, value: undefined }, 'long', 'short', 'narrow', 'numeric','2-digit']" />
          <URadioGroup v-model="options.day" legend="Day" :items="[{ label: 'undefined', ui: {label: 'text-purple-500'}, value: undefined }, 'numeric','2-digit']" />
          <URadioGroup v-model="options.weekday" legend="Weekday" :items="[{ label: 'undefined', ui: {label: 'text-purple-500'}, value: undefined }, 'long','short','narrow']" />
        </div>
        <div class="flex gap-8">
          <URadioGroup v-model="options.hourCycle" legend="Hour Cycle" :items="['h11','h12','h23','h24']" />
          <URadioGroup v-model="options.dayPeriod" legend="Day Period" :items="[{ label: 'undefined', ui: {label: 'text-purple-500'}, value: undefined }, 'long', 'short', 'narrow']" />
          <URadioGroup v-model="options.hour" legend="Hour" :items="[{ label: 'undefined', ui: {label: 'text-purple-500'}, value: undefined }, 'numeric','2-digit']" />
          <URadioGroup v-model="options.minute" legend="Minute" :items="[{ label: 'undefined', ui: {label: 'text-purple-500'}, value: undefined }, 'numeric','2-digit']" />
          <URadioGroup v-model="options.second" legend="Second" :items="[{ label: 'undefined', ui: {label: 'text-purple-500'}, value: undefined }, 'numeric','2-digit']" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>