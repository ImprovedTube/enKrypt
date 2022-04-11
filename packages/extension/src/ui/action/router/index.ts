import { createRouter, createWebHashHistory } from "vue-router";
import Intro from "@action/views/intro/index.vue";
import AddNetwork from "@action/views/add-network/index.vue";
import NetworkActivity from "@action/views/network-activity/index.vue";
import NetworkAssets from "@action/views/network-assets/index.vue";
import NetworkDApps from "@action/views/network-dapps/index.vue";
import NetworkNFTs from "@action/views/network-nfts/index.vue";

const routes = [
  {
    path: "/",
    components: {
      view: Intro,
    },
    name: "intro",
  },
  {
    path: "/activity/:id?",
    components: {
      view: NetworkActivity,
    },
    name: "activity",
  },
  {
    path: "/assets/:id?",
    components: {
      view: NetworkAssets,
    },
    name: "assets",
  },
  {
    path: "/dapps/:id?",
    components: {
      view: NetworkDApps,
    },
    name: "dapps",
  },
  {
    path: "/nfts/:id?",
    components: {
      view: NetworkNFTs,
    },
    name: "nfts",
  },
  {
    path: "/add-network",
    components: {
      view: AddNetwork,
    },
    name: "add-network",
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});