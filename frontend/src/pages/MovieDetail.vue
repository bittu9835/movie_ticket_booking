<template>
    <div v-if="!movieResource.loading && movieResource.doc" class="sm:px-28 sm:py:8 p-8">
        <div class="flex flex-row items-center justify-between">
            <div class="flex items-center space-x-4 truncate">
                <router-link to="/" v-if="currentStep === 0">
                    <i class="fas fa-arrow-left text-2xl"></i>
                </router-link>
                <p class="text-3xl font-bold text-gray-800">{{ movieDoc.title }}</p>
            </div>
            <Dropdown :options="options">
                <Button class="rounded-full w-10 h-10">
                    <template #icon>
                        <Avatar :shape="'circle'" :image="null" :label="session.user" size="lg" class="cursor-pointer" />
                    </template>
                </Button>
            </Dropdown>
        </div>
        <div class="flex justify-between mt-10 mb-10">
            <div>
                <p class="text-gray-700 font-bold uppercase">DIRECTOR</p>
                <p class="text-gray-600 font-normal">{{ movieDoc.director }}</p>
            </div>
            <div>
                <p class="text-gray-700 font-bold uppercase">RELEASE DATE</p>
                <p class="text-gray-600 font-normal">{{ movieDoc.release_date }}</p>
            </div>
        </div>
        <div v-if="currentStep === 0">
            <div class="w-full flex justify-center items-center">
                <img :src=movieDoc.poster class="sm:w-1/3 w-full h-full p-2 shadow-md rounded bg-white" alt="poster">
            </div>
            <div class="w-full flex justify-center items-center mt-6">
                <Button size="xl" variant="solid" @click="currentStep++">Book Tickets</Button>
            </div>
            <div class="mt-12 space-y-3">
                <p class="text-gray-700 text-xl font-bold uppercase">Synopsis</p>
                <p class="text-gray-600 font-normal">{{ movieDoc.synopsis }}</p>
            </div>
        </div>
        <div v-else-if="currentStep === 1">
            <p class="font-medium text-gray-900">How Many Seats ?</p>
            <div class="flex flex-col gap-2 mt-6">
                <Button v-for="(index) in 8" @click="seatNumberOfSeat(index)" size="lg"
                    :variant="index === bookingData.numberOfSheat ? 'subtle' : 'white'" class="shadow-lg text-gray-800">{{
                        index }}</Button>
            </div>
        </div>
        <div v-else-if="currentStep === 2">
            <div class="flex flex-col space-y-4">
                <p class="font-medium text-gray-900">Date</p>
                <Input type="date" v-model="bookingData.date" />
            </div>
            <div class="flex flex-col space-y-4 mt-7">
                <p class="font-medium text-gray-900">Cinema & Show</p>
                <div v-for="theater in Object.keys(theaterShow.data)" :key="theater.name"
                    class="bg-white shadow-xl p-4 rounded  flex flex-col space-y-3">
                    <h3 class="text-xs font-bold text-gray-800">{{ theater }}</h3>
                    <div class="flex flex-row space-x-2">
                        <Button @click="bookingData.show = show.name" :key="show.name"
                            v-for="show in theaterShow.data[theater]" size="sm"
                            :variant="show.name === bookingData.show ? 'subtle' : 'outline'">{{ show.start_time }}</Button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="currentStep === 3">
            <p class="font-medium text-gray-900 mb-8">Select Seats</p>
            <div class="flex flex-col justify-center items-center">
                <div :key="row" class="flex flex-row" v-for="row in Object.keys(seatStrucure)">
                    <span @click="selectSeat(row, seat[0])" v-for="seat in seatStrucure[row]"
                        class="w-6 h-8 m-2 rounded-[2px]"
                        :class="[seat[1] === 'Available' ? 'bg-blue-300' : seat[1] === 'Selected' ? 'bg-blue-600' : 'bg-gray-300', hasSelectedCorrectNumberOfSeat ? 'cursor-not-allowed' : 'cursor-pointer']">
                    </span>
                </div>
            </div>
        </div>
        <div v-else-if="currentStep === 4">
            <div class="w-full flex flex-col mt-7 justify-center items-center">
                <h1 class="text-[110px]">🍿</h1>
                <h2 class="font-medium text-xl mt-7 text-gray-900">Enjoy the Movie!</h2>
                <router-link to="/" class="text-sm text-blue-500 mt-10 cursor-pointer">Book Another Ticket</router-link>
            </div>
        </div>
        <div class="flex flex-row space-x-2 mt-4">
            <Button size="lg" variant="subtle" v-if="currentStep !== 0 && currentStep !== 4" @click="currentStep--">Go
                Back</Button>
            <Button size="lg" variant="solid" v-if="currentStep !== 0 && currentStep !== 4" :disabled="!nextButtonEnabled"
                @click="handleNextSteps()">Next</Button>
        </div>
    </div>
</template> 
  
<script setup>
// import poster from '@/assets/img/avatar.jpeg';
import { ref, reactive, computed, h } from 'vue';
import { createDocumentResource, createListResource, Avatar, Dropdown, FeatherIcon } from 'frappe-ui';
import { session } from '@/data/session'
import '@fortawesome/fontawesome-free/css/all.css';

const props = defineProps({
    movieName: {
        type: String,
        required: true
    }
})
let options = [
    {
        label: 'Profile',
        icon: () => h(FeatherIcon, { name: "user" }),
    },
    {
        label: 'Log Out',
        onClick: () => {
            session.logout.submit()
        },
        icon: () => h(FeatherIcon, { name: "log-out" }),
    },
]
const movieResource = createDocumentResource({
    doctype: 'Movie',
    name: props.movieName,
    onSuccess(doc) {
        // console.log(doc)
    },
    auto: true
});

const theaterShow = createListResource({
    doctype: 'Theater show',
    fields: ['theater', 'start_time', 'name'],
    auto: true,
    transform: (shows) => {
        const groupedShows = {}
        for (const show of shows) {
            if (!groupedShows[show.theater]) {
                groupedShows[show.theater] = []
            }
            groupedShows[show.theater].push(show)
        }
        return groupedShows;
    }
});

const movieBooking = createListResource({
    doctype: "Ticket Booking", insert: {
        onSuccess() {
            console.log('Booking Created')
            currentStep.value++
        }
    }
})
// const abc = createListResource({
//     doctype: "Movie Theater", 
//     fields: ['seat_column'],
//     auto: true,
// })
// // const test = computed(() => abc.doc)
// console.log(abc)

const getSeatStructure = (alphabets, numbers) => {
    const structure = {};
    for (const alphabet of alphabets) {
        structure[alphabet] = [];
        for (const number of numbers) {
            structure[alphabet].push([number, 'Available']);
        }
    }
    return structure;
};

const seatStrucure = reactive(getSeatStructure(
    ['A', 'B', 'C', 'D', 'E'],
    [1, 2, 3, 4, 5, 6, 7,8,9,10]
))

const today = new Date().toISOString().substr(0, 10);
const currentStep = ref(0);
const bookingData = reactive({
    numberOfSheat: 0,
    selectedSeats: [],
    date: today,
    show: null
})

function seatNumberOfSeat(n) {
    bookingData.numberOfSheat = n
}

function selectSeat(row, number) {
    if (hasSelectedCorrectNumberOfSeat.value) {
        return
    }
    const seat = seatStrucure[row].find((seat) => seat[0] === number)
    seat[1] = 'Selected'
    bookingData.selectedSeats.push(`${row}${number}`)
}

const hasSelectedCorrectNumberOfSeat = computed(() => {
    return bookingData.selectedSeats.length === bookingData.numberOfSheat
})

const movieDoc = computed(() => movieResource.doc)

const nextButtonEnabled = computed(() => {
    if (currentStep.value === 1) {
        return bookingData.numberOfSheat
    } else if (currentStep.value === 2) {
        return bookingData.date && bookingData.show
    } else if (currentStep.value === 3) {
        return hasSelectedCorrectNumberOfSeat.value
    }
})

const handleNextSteps = () => {
    if (currentStep.value !== 3) {
        currentStep.value++
        return
    }
    movieBooking.insert.submit({
        movie: props.movieName,
        date: bookingData.date,
        show: bookingData.show,
        selected_seats: JSON.stringify(bookingData.selectedSeats),
        number_of_tickets: bookingData.numberOfSheat
    })
}
</script>