var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repair');

var creepObj = {Body: [], }
//var pathFinder = require('pathFinder');
//var constructionSites = require('constructionSites');

//var spawnPos = Game.spawns['Spawn1'].pos;
//var sourcePos= Game.spawns['Spawn1'].room.find(FIND_SOURCES);
//var contrPos = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
//    filter: (structure) => {
//       return (structure.structureType == STRUCTURE_CONTROLLER)
//    }
//});


//var avaEnergy = () => { return Game.rooms['E37S16'].energyAvailable };
//var totEnergy = () => { return Game.rooms['E37S16'].energyCapacityAvailable };

var harBody = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY,CARRY,CARRY, CARRY, CARRY , MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
//var upBody = [3, 6, 4, 0, 0, 0, 0];

/*
var distance = () => {
    var source0 = sourcePos[0].pos;
    var source1 = sourcePos[1].pos;
    console.log(spawnPos.x)

    var temp = Math.abs(Math.sqrt(Math.pow(source0.x - spawnPos.x,2)+Math.pow(source0.y - spawnPos.y,2))) + 
    Math.abs(Math.sqrt(Math.pow(source1.x - spawnPos.x,2)+Math.pow(source1.y - spawnPos.y,2)));
    var temp2= Math.abs(Math.sqrt(Math.pow(source0.x - contrPos.x,2)+Math.pow(source0.y - contrPos.y,2))) + 
    Math.abs(Math.sqrt(Math.pow(source1.x - contrPos.x,2)+Math.pow(source1.y - contrPos.y,2)));
    return temp + temp2;
    }
    */

/*
var findBody = (workParts, carryParts, moveParts, attackParts, healParts, rAttackParts, toughParts) => {
    var body = [];
    for (var i = 0; i < workParts; i++) {
        body.push(WORK);
    }
    for (var i = 0; i < carryParts; i++) {
        body.push(CARRY);
    }
    for (var i = 0; i < moveParts; i++) {
        body.push(MOVE);
    }
    for (var i = 0; i < attackParts; i++) {
        body.push(ATTACK);
    }
    for (var i = 0; i < healParts; i++) {
        body.push(HEAL);
    }
    for (var i = 0; i < rAttackParts; i++) {
        body.push(RANGED_ATTACK);
    }
    for (var i = 0; i < toughParts; i++) {
        body.push(TOUGH);
    }
    return body;
};*/

var sourceCount = 0;
module.exports.loop = function () {
    //console.log(sourceCount %2);
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    var towers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES,
        {
            filter: (structure) => {
                //console.log(structure.structureType)
                return (structure.structureType == STRUCTURE_TOWER)
            }
        }
    );
    if(towers.length > 0){
        for(var i = 0; i< towers.length;i++){
            var hostiles = Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS);
            towers[i].attack(towers[i].pos.findClosestByRange(hostiles));
        }
    }  
    var harvesters = [];
    var upgraders = [];
    var builders = [];
    var repairer = [];

    for(name in Game.creeps){
        var creep = Game.creeps[name];
        var time = creep.ticksToLive;
        var tempRole = creep.memory.role;
        if(tempRole === 'harvester' && time >=harBody.length *CREEP_SPAWN_TIME){
            harvesters.push(creep);
        }
        else if(tempRole === 'upgrader' && time >=harBody.length *CREEP_SPAWN_TIME){
            upgraders.push(creep);
        }
        else if(tempRole === 'builder' && time >=harBody.length *CREEP_SPAWN_TIME){
            builders.push(creep);
        }
        else if(tempRole === 'repairer' && time >=harBody.length *CREEP_SPAWN_TIME){
            repairer.push(creep);
        }
    }
    var towers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES,
        {
            filter: (structure) => {
                //console.log(structure.structureType)
                return (structure.structureType == STRUCTURE_CONTAINER)
            }
        }
    );
    //console.log(harvesters + ' ' + upgraders + ' ' + builders + ' ' + repairer);
    if (Game.spawns['Spawn1'].spawning === null) {
        if (harvesters.length < 4) {
            var newName = 'Harvester' + Game.time;
            Game.spawns['Spawn1'].spawnCreep(harBody, newName, { memory: { role: 1 } });
        }
        else if (upgraders.length < 2) {
            var newName = 'Upgrader' + Game.time;
            Game.spawns['Spawn1'].spawnCreep(harBody, newName, { memory: { role: 2 } });
        }
        else if (repairer.length < 1) {
            var newName = 'Repairer' + Game.time;
            Game.spawns['Spawn1'].spawnCreep(harBody, newName, { memory: { role: 3 } });
        }
        else if (builders.length < 0) {
            var newName = 'Builder' + Game.time;
            Game.spawns['Spawn1'].spawnCreep(harBody, newName, { memory: { role: 4 } });
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        creep.pickup(RESOURCE_ENERGY);
        
        if (creep.memory.role === 1) {
            creep.memory.role = 'harvester';
            creep.memory.mode = 'harvester';
            creep.memory.harvesting = true;
            creep.memory.source = sourceCount % 2;
            sourceCount++;
        }
        else if (creep.memory.role === 2) {
            creep.memory.role = 'upgrader';
            creep.memory.upgrading = true;
            creep.memory.source = sourceCount % 2;
        }
        else if (creep.memory.role === 3) {
            creep.memory.role = 'repairer';
            creep.memory.repairing = true;
            creep.memory.repairingID;
            creep.memory.source = sourceCount % 2;
        }
        else if (creep.memory.role === 4) {
            creep.memory.role = 'builder';
            creep.memory.building = true;
            creep.memory.source = sourceCount % 2;
        }
        if (creep.memory.role === 'harvester') {

            roleHarvester.run(creep);
        }
        if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role === 'builder') {
            if(creep.room.find(FIND_MY_CONSTRUCTION_SITES).length === 0)
            {
                roleHarvester.run(creep);
            }
            else
            {
                roleBuilder.run(creep);
            }  
        }
        if (creep.memory.role === 'repairer') {
            roleRepairer.run(creep);
        }


    }

}