import { world, system, EntityDamageCause, Player } from "@minecraft/server";
import "./tps.js";
import "./event/death.js";
import "./event/player.js";
import { getTps } from "./tps.js";

const appHandledMessages = false;
export const mcprefix = "§7[§aBDS§1 Auto Enable §a]§r ";
export const consoleprefix = "[BDS Auto Enable] ";

system.afterEvents.scriptEventReceive.subscribe((event) => {
  // console.log(
  //   "id:", event.id,
  //   "message:", event.message,
  //   "sourceType:", event.sourceType
  // );

  if (event.id == "bds:tps") {
    getTps();;
  }

});

const cooldowns = new Map();
world.beforeEvents.chatSend.subscribe((data) => {
  const player = data.sender;
  const name = player.name;
  const message = data.message;

  if (cooldowns.has(name) && (Date.now() - cooldowns.get(name)) / 1000 < 2) {
    data.sender.sendMessage(mcprefix + "§cZwolnij troche! (2s)");
    data.cancel = true;
  } else {
    if (message.startsWith("!")) {
      console.log("PlayerCommand:" + name + " Command:" + message + " Op:" + player.isOp());
      data.cancel = true;
      return;
    }

    if (!player.isOp()) {
      cooldowns.set(name, Date.now());
    }

    console.log("PlayerChat:" + name + " Message:" + message);
    data.cancel = appHandledMessages;
  }
},
);

world.sendMessage(mcprefix + '§3Wczytano!');
console.log(consoleprefix + 'Wczytano!');
