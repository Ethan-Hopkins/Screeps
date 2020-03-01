var arr = [];
var func = () => {
    var repairable = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES,
        {
            filter: (structure) => {
                if(structure.structureType === STRUCTURE_ROAD) structure.tempHits = structure.hits*200;
                else if(structure.structureType == STRUCTURE_CONTAINER) structure.tempHits = structure.hits*4;
                else{
                    structure.tempHits = structure.hits;
                }
                return (structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_WALL)
            }
        }
    );

    arr.length = 0;
    for (var i = 0; i < repairable.length; i++) {
        arr.push(repairable[i]);
    }
}
var findMostDeadID = () => {
    
    var tempMostDead = arr[0];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i].tempHits < tempMostDead.tempHits) {
            
            tempMostDead = arr[i];
        }
    }
    return tempMostDead.id;
}
var roleRepair =
{
    run: (creep) => {
        
        func();
        if (creep.memory.repairing && creep.carry.energy === 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.repairing && creep.carry.energy === creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.memory.repairingID = findMostDeadID();
            creep.say('⚡ repair');
        }

        if (creep.memory.repairing) {
            if (creep.repair(Game.getObjectById(creep.memory.repairingID)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.repairingID), { visualizePathStyle: { stroke: '#ffffff' } });
            }
            if (Game.getObjectById(creep.memory.repairingID).hits === Game.getObjectById(creep.memory.repairingID).hitsMax) {
                creep.memory.repairingID = findMostDeadID();
            }

        }
        else {
            if(typeof creep.room.storage !== 'undefined' && creep.room.storage.store[RESOURCE_ENERGY] >= 20000){
                if (creep.withdraw(creep.room.storage,RESOURCE_ENERGY,creep.carryCapacity) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage,RESOURCE_ENERGY, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            else{
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.source], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    }
}


module.exports = roleRepair;