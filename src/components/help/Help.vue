<template>
    <div>
        <h3 id="0">Help</h3>
        <ul>
            <router-link
                    v-for="id in 20"
                    :key="id"
                    tag="li"
                    :to="anchorLink(id)"
            ><a>Go to #help{{ id }}</a></router-link>
        </ul>

        <div v-for="n in 20">
            <h5 :id="'help' + n">Help{{ n }} <a href="#0"><v-icon>keyboard_arrow_up</v-icon></a></h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam aperiam commodi corporis dolorem ducimus esse est fugit impedit incidunt ipsa iste mollitia, odio porro quidem. Distinctio dolore, eveniet ipsum nam nesciunt quaerat ut voluptatibus. Aliquid deleniti eaque fuga fugiat ipsam voluptatem voluptatibus! Ad architecto, blanditiis consequuntur dicta doloremque dolores expedita harum illo ipsam ipsum laboriosam maxime molestias mollitia nam necessitatibus non nostrum odit officiis optio praesentium provident quasi quibusdam quidem, quo quod repellendus sit tempora totam unde velit veniam vero vitae voluptas! Ad dolores fuga iste repellat. Accusantium aliquid blanditiis deserunt harum id, libero maxime nihil ut voluptate voluptatum?</p>

            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam aperiam commodi corporis dolorem ducimus esse est fugit impedit incidunt ipsa iste mollitia, odio porro quidem. Distinctio dolore, eveniet ipsum nam nesciunt quaerat ut voluptatibus. Aliquid deleniti eaque fuga fugiat ipsam voluptatem voluptatibus! Ad architecto, blanditiis consequuntur dicta doloremque dolores expedita harum illo ipsam ipsum laboriosam maxime molestias mollitia nam necessitatibus non nostrum odit officiis optio praesentium provident quasi quibusdam quidem, quo quod repellendus sit tempora totam unde velit veniam vero vitae voluptas! Ad dolores fuga iste repellat. Accusantium aliquid blanditiis deserunt harum id, libero maxime nihil ut voluptate voluptatum?</p>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
          anchorLink(id) {
            return {
              path: '/help',
              hash: '#help' + id
            }
          }
        }
    }
</script>

<style scoped>
    p {
        margin-bottom: 40px;
    }

</style>