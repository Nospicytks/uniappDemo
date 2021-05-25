<template>
  <view class="calendar">
    <ss-calendar
      :checks="checks"
      @current-month-day="onSignIn"
      @prev-month-day="onPrev"
      @next-month-day="onNext"
    />
  </view>
</template>

<script>
import ssCalendar from '@/components/ss-calendar/ss-calendar.vue'
export default {
  data() {
    return {
      checks: []
    }
  },
  components: {
    ssCalendar
  },
  methods: {
    onSignIn(payload) {
      const { checked, year, month, day } = payload

      !checked && this.checks.push(`${year}-${month}-${day}`)

      console.log('onSignIn', payload)
    },
    onPrev(payload) {
      console.log('onPrev', payload)
    },
    onNext(payload) {
      console.log('onNext', payload)
    }
  }
}
</script>
