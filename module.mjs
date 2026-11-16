// @ts-check
import { module } from "@prisma/composer";
import chatgptHomepageService from "./service.mjs";

export default module("chatgpt-homepage", ({ provision }) => {
	provision(chatgptHomepageService, { id: "chatgpthomepage" });
});
