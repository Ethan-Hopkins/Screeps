var roleUpgrader = require('role.upgrader');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var mode = creep.memory.mode === 'harvester';


        if (mode) {
            if (creep.memory.harvesting && creep.carry.energy === 0) {
                creep.memory.harvesting = false;
                creep.say('🔄 harvest');
            }
            if (!creep.memory.harvesting && creep.carry.energy === creep.carryCapacity) {
                creep.memory.harvesting = true;
                creep.say('⚡ power');
            }
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
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity;
                    }
                });

                if (creep.room.storage.hits <= 5000) {
                    creep.room.controller.activateSafeMode();
                }
                targets.push(creep.room.storage);
                //var sources = creep.room.find(FIND_SOURCES);
                //&& (sources[creep.memory.source].energy !==0|| sources[creep.memory.source].ticksToRegeneration >= 30)
                if (targets.length > 0) {

                    if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
                else {
                    creep.memory.mode = 'upgrade';
                }
            }
        }
        else {
            roleUpgrader.run(creep);
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            targets.push(creep.room.storage);
            if (targets.length > 0) {
                creep.memory.mode = 'harvester';
            }
        }
    }
};

module.exports = roleHarvester;

/**
 * public class ImGOnnaSplooge {
 *          public static void main (String[] args) {
 *                  System.out.println("IM GONNA SPLOOOOOOOOOOOOOOGE!!!!!!!!!!!!");
 *          }
 * }
 */