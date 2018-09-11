TODO
----

## General

- [ ] Add 20 minute timeout for orders - Might be a bit harder than expected, but shouldn't be a big deal
- [ ] Ping when orders cook, claim etc
- [ ] Mention that order has been delivered to claimer when its been cooked
- [ ] Move from embedCreator to the official discord.js embed creator
- [ ] Instead of deleting tickets, tickets should be given another status, and then be filtered out of lists etc.


## Sharding

- [ ] Check what currently works
- Possible plans of action:
  - Running the commands through all shards to ensure that the code will work in at least one
  - Work out the right shard (JIT) and only run the command in the right shard
  - Word out the right shard before time and only run the command in the right shard 

# Config


- [ ] Add config that can be edited by admins for:
  - [ ] Automatic or manual (hasn't been developed yet though) delivery
  - [ ] The content of the automatic delivery system

## Refactoring

- [ ] Move commands into seperate folder, kind of like how derpys rewrite does it.

