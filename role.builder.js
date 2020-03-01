var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
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

module.exports = roleBuilder;