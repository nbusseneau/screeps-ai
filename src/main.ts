import Builder from "roles/builder";
import Harvester from "roles/harvester";
import Upgrader from "roles/upgrader";
import { ErrorMapper } from "utils/ErrorMapper";

function main(): void {
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == "harvester");
  if (harvesters.length < 2) {
    var newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: "harvester" } });
  }

  const builders = _.filter(Game.creeps, (creep) => creep.memory.role == "builder");
  if (builders.length < 1) {
    const newName = "Builder" + Game.time;
    console.log("Spawning new builder: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: "builder" } });
  }

  const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == "upgrader");
  if (upgraders.length < 1) {
    const newName = "Upgrader" + Game.time;
    console.log("Spawning new upgrader: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: "upgrader" } });
  }

  if (Game.spawns["Spawn1"].spawning) {
    const spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name];
    Game.spawns["Spawn1"].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y,
      { align: "left", opacity: 0.8 }
    );
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    switch (creep.memory.role) {
      case "harverster":
        Harvester.run(creep);
        break;
      case "upgrader":
        Upgrader.run(creep);
        break;
      case "builder":
        Builder.run(creep);
        break;
    }
  }
}

export const loop = ErrorMapper.wrapLoop(main);
