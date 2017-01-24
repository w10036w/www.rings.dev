<template>
	<div class="homeBanner">
		<swipe v-if="homeBanner.length" :auto="6000">
			<swipe-item class="banner" v-for="e in homeBanner">
				<a :href="getUrl(e.click_url)">
					<div class="poster"
							 :style="'background-image:url('+e.pic_url+')'" >
					</div>
				</a>
			</swipe-item>
		</swipe>
	</div>
</template>
<script>
import { Swipe, SwipeItem } from 'vue-swipe'
export default {
	name: 'widget-home-banner',
	components: { Swipe, SwipeItem },
	computed: {
		homeBanner() {return this.$store.getters.homeBanner},
	},
	methods: {
		getUrl(s) {
			let uri = s.split('?url=')[1]
			return decodeURIComponent(uri)
		},
	},

}
</script>
<style lang="stylus">
.homeBanner
	height 40vw
	width 100%
	margin-bottom 15px
	.poster
		height 100%
		background-size cover
</style>
