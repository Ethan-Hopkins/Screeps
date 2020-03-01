var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
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
};

module.exports = roleUpgrader;