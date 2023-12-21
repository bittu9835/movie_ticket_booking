<template>
    <div v-if="movies.data" class="p-4">
        <h2 class="font-bold mb-9">Movie List</h2>
        <div
            className='w-full overflow-y-auto scrollbar-thin gap-2 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 xl:grid-cols-5 p-2'>
            <div v-for="movie in movies.data"
                className="rounded-md cursor-pointer h-80 flex text-skin-base bg-skin-fill-card flex-col shadow-lg">
                <router-link :to="{ name: 'MovieDetail', params: { movieName: movie.name } }">
                    <div className='h-72 rounded-t-md'>
                        <img :src="movie.poster" className='w-full h-full rounded-t-md' alt="" />
                    </div>
                    <div className='h-8 flex items-center justify-center'>
                        <h1 className='font-medium truncate'>{{ movie.title }}</h1>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script setup>
import { createListResource } from 'frappe-ui';


const movies = createListResource({
    doctype: 'Movie',
    fields: ['name', 'title', 'release_date', 'director', 'poster'],
    auto: true
})
</script>