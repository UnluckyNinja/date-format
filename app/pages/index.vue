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

function isLocaleValid(locale: Intl.Locale) {
  return locale.maximize().region !== undefined
}
const isInputLocaleValid = ref(false)
const possibleValues = computed(()=>{
  if(!isInputLocaleValid.value) {
    return [locale.value, ...navigator.languages]
  }
  const loc = new Intl.Locale(inputLocale.value)
  return [...new Set([loc.baseName, loc.maximize().baseName, ...navigator.languages])]
})
</script>

<template>
  <div class="flex flex-col max-h-dvh">
    <div class="my-20 text-center text-4xl">
      <NuxtTime :datetime :relative :locale v-bind="options" />
    </div>
    <div class="flex flex-row items-start justify-evenly overflow-y-scroll gap-4">
      <div class="flex flex-col gap-4 text-left">
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
        <URadioGroup v-model="options.timeZoneName" legend="Time Zone Name" :items="[null, 'long', 'short', 'shortOffset', 'longOffset', 'shortGeneric', 'longGeneric']" />
      </div>
      <URadioGroup v-model="options.hourCycle" legend="Hour Cycle" :items="['h11','h12','h23','h24']" />
      <URadioGroup v-model="options.era" legend="Era" :items="[null, 'long','short','narrow']" />
      <URadioGroup v-model="options.year" legend="Year" :items="[null, 'numeric','2-digit']" />
      <URadioGroup v-model="options.month" legend="Month" :items="[null, 'long', 'short', 'narrow', 'numeric','2-digit']" />
      <URadioGroup v-model="options.day" legend="Day" :items="[null, 'numeric','2-digit']" />
      <URadioGroup v-model="options.weekday" legend="Weekday" :items="[null, 'long','short','narrow']" />
      <URadioGroup v-model="options.dayPeriod" legend="Day Period" :items="[null, 'long', 'short', 'narrow']" />
      <URadioGroup v-model="options.hour" legend="Hour" :items="[null, 'numeric','2-digit']" />
      <URadioGroup v-model="options.minute" legend="Minute" :items="[null, 'numeric','2-digit']" />
      <URadioGroup v-model="options.second" legend="Second" :items="[null, 'numeric','2-digit']" />    </div>
  </div>
</template>

<style scoped>

</style>