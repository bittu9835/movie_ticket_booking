<template>
    <div v-if="movies.data" class="p-4">
        <div class="flex flex-row items-center justify-between mb-9">
            <h2 class="font-bold ">Movie List</h2>
            <Dropdown :options="options">
                <Button class="rounded-full w-10 h-10">
                    <template #icon>
                        <Avatar :shape="'circle'" :image="null" :label="session.user" size="lg" class="cursor-pointer" />
                    </template>
                </Button>
            </Dropdown>

        </div>

        <div
            className='w-full overflow-y-auto scrollbar-thin gap-5 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 xl:grid-cols-5 p-2'>
            <div v-for=" movie  in  movies.data "
                className="rounded-md cursor-pointer h-80 flex text-skin-base bg-skin-fill-card flex-col shadow-lg">
                <router-link :to="{ name: 'MovieDetail', params: { movieName: movie.name } }">
                    <div className='h-72 rounded-t-md'>
                        <img :src="movie.poster"
                            className='w-full h-full rounded-t-md hover:-translate-y-2 duration-200 transition-all'
                            alt="" />
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
import { Avatar, Dropdown, FeatherIcon, createListResource } from 'frappe-ui';
import { session } from '@/data/session'
import { h } from 'vue';

const movies = createListResource({
    doctype: 'Movie',
    fields: ['name', 'title', 'release_date', 'director', 'poster'],
    auto: true
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
</script>