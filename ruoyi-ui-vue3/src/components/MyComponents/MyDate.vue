<template>
  <div class="calendar" :style="{ backgroundColor: 'beige', width: '100%', height: 'auto', padding: '20px' }">
    <header :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
      <button @click="prevMonth">&lt;</button>
      <h2>{{ year }}年{{ month + 1 }}月{{ date }}日 {{ hours }}:{{ minutes }}:{{ seconds }}</h2>
      <button @click="nextMonth">&gt;</button>
    </header>
    <div class="weekdays" :style="{ display: 'flex' }">
      <div v-for="day in weekdays" :key="day" :style="{ width: '14.28%', textAlign: 'center', padding: '10px', border: '1px solid #ddd' }">{{ day }}</div>
    </div>
    <div class="days-grid" :style="{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }">
      <div v-for="n in emptyDaysAtStart" :key="`empty-${n}`" :style="{ width: '14.28%', textAlign: 'center', padding: '10px', border: '1px solid #ddd', margin: '5px' }"></div>
      <div v-for="day in daysInMonth" :key="day" :class="{ today: isToday(day), 'has-festival': hasFestival(day) }" @click="selectDay(day)" :style="{ width: '14.28%', textAlign: 'center', padding: '10px', border: '1px solid #ddd', margin: '0px' }">
        {{ day }}
        <div v-if="hasFestival(day)" class="festival" :style="{ position: 'absolute', bottom: '0', fontSize: '0.8em', color: 'blue' }">{{ getFestival(day) }}</div>
        <div v-if="isToday(day)" class="today-circle"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import lunar from 'lunar-javascript';

export default {
  name:"MyComponentDate",
  data() {
    return {
      year: moment().year(),
      month: moment().month(),
      date: moment().date(),
      hours: moment().hours(),
      minutes: moment().minutes(),
      seconds: moment().seconds(),
      daysInMonth: [],
      emptyDaysAtStart: 0,
      today: moment().format('DD'),
      selectedDay: null
    };
  },
  computed: {
    weekdays() {
      const startDay = moment([this.year, this.month]).startOf('month').day();
      let weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      weekdays = weekdays.slice(startDay).concat(weekdays.slice(0, startDay));
      return weekdays;
    }
  },
  methods: {
    prevMonth() {
      this.month--;
      if (this.month < 0) {
        this.month = 11;
        this.year--;
      }
      this.generateCalendarData();
    },
    nextMonth() {
      this.month++;
      if (this.month > 11) {
        this.month = 0;
        this.year++;
      }
      this.generateCalendarData();
    },
    generateCalendarData() {
      this.emptyDaysAtStart = moment([this.year, this.month]).startOf('month').day();
      const daysInMonth = moment([this.year, this.month]).endOf('month').date();
      this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    },
    isToday(day) {
      return this.today === day.toString();
    },
    hasFestival(day) {
      const lunarDate = lunar.Solar.fromDate(new Date(this.year, this.month, day));
      return lunarDate.getFestivals().length > 0;
    },
    getFestival(day) {
      const lunarDate = lunar.Solar.fromDate(new Date(this.year, this.month, day));
      return lunarDate.getFestivals()[0] || '';
    },
    selectDay(day) {
      this.selectedDay = day;
    }
  },
  mounted() {
    this.generateCalendarData();
    this.interval = setInterval(() => {
      this.date = moment().date();
      this.hours = moment().hours();
      this.minutes = moment().minutes();
      this.seconds = moment().seconds();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style scoped>
.calendar {
  /* Additional styles can be added here */
}
header {
  /* Your styles here */
}
.weekdays {
  /* Your styles here */
}
.days-grid {
  /* Your styles here */
}
.today {
  background-color: #ff9999; /* Light red background for today's date */
  color: #113ab4; /* White text color */
}
.has-festival {
  /* Your styles here */
  position: relative;
}
.festival {
  /* Your styles here */
  position: absolute;
  bottom: 0;
  font-size: 0.8em;
  color: blue; /* Changed to blue */
}
.today-circle {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: black;
  border-radius: 50%;
  position: absolute;
  right: 2px;
  bottom: 2px;
}
</style>
