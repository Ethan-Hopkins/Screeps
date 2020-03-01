var pathFinder = {
    run: (creep, ePos) => {
        var path = PathFinder.search(creep.pos, ePos);
        return path;
    }
}
module.exports = pathFinder;