<template>
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header
      mdl-layout--fixed-tabs">
  <header class="mdl-layout__header">
    <div class="mdl-layout__header-row">
      <!-- Title -->
      <span class="mdl-layout-title">Title</span>
    </div>
    <!-- Tabs -->
    <div class="mdl-layout__tab-bar mdl-js-ripple-effect">
      <a href="#fixed-tab-live" class="mdl-layout__tab is-active">LIVE</a>
      <a href="#fixed-tab-upcoming" class="mdl-layout__tab">UPCOMING</a>
      <a href="#fixed-tab-replay" class="mdl-layout__tab">REPLAY</a>
      <!--<a href="#fixed-tab-user" class="mdl-layout__tab">USER</a>-->
    </div>
  </header>
  <div class="mdl-layout__drawer">
    <span class="mdl-layout-title">RINGS.TV</span>
  </div>
  <main class="mdl-layout__content">
    <section class="mdl-layout__tab-panel is-active" id="fixed-tab-live">
      <div class="page-content">
        <div v-for="e in home_lives">{{ e.event_title }}</div>
      </div>
    </section>
    <section class="mdl-layout__tab-panel" id="fixed-tab-upcoming">
      <div class="page-content"><!-- Your content goes here --></div>
    </section>
    <section class="mdl-layout__tab-panel" id="fixed-tab-replay">
      <div class="page-content">

      </div>
    </section>
    <!--<section class="mdl-layout__tab-panel" id="fixed-tab-user">
      <div class="page-content">&lt;!&ndash; Your content goes here &ndash;&gt;</div>
    </section>-->
  </main>
</div>
</template>
<style>

</style>
