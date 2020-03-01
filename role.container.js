roleHarvester = {
    
    run: function (creep) {
        var mode = creep.memory.mode === 'container';

        if(mode){
            if (!creep.memory.harvesting) {
                var sources = creep.room.find(FIND_SOURCES);
                if ((sources[creep.memory.source].energy === 0 && sources[creep.memory.source].ticksToRegeneration >= 20) && creep.carry.energy !== 0) {
                    creep.memory.harvesting = true;
                    creep.say('⚡ power');
                }
                else {
                    if (creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[creep.memory.source], { visualizePathStyle: { stroke: '#ffaa00' } });

                    }
                }
            }
        }
    }
}