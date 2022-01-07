
const SettingsUI = require('tera-mod-ui').Settings

module.exports = function salchyarcanepulse(mod) {
	
	let ui = null
	if (global.TeraProxy.GUIMode) {
		ui = new SettingsUI(mod, require('./settings_structure'), mod.settings, { height: 390 })
		ui.on('update', settings => {
			mod.settings = settings
		})
		
		this.destructor = () => {
			if (ui) {
				ui.close()
				ui = null
			}
		}
	}
	
	mod.command.add("salui", () => { if (ui) ui.show() })
		
	mod.game.initialize('inventory');
	
	const options = mod.settings
	
	let arcane_id = 41213
	let arcane_id_mb = 41213
	let arcane_id_anim = 330112
	let MB_active = false
	let mb_abnormality_id = 503061
	let hail_id = 270900 //260100
    let tp_id = 260100
	let sorc_job = 4
	let sorc_enab = false
	let job
	let model
	let enabled = false
	let cid
	let myPosition = null
	let myAngle = null
	let monsters = []
	let people = []
	let arcaneSpamInt = null
	let arcane_packet = {}
	let mb_packet = {}
	let hail_packet = {}
	let tp_packet = {}
	let lance_packet = {}
	let endp
	let zbug
	let bugme = false
	let etarg
	let party = []
	let mana_boost_cd = false
	let hail_cd = false
	let tp_cd = false
	let CD_mana
	let CD_hail
	let CD_tp
	let cancelanim = false
	let bossid = null
	let bossloc = null
	let myCurrentRE = null
	let burst_packet = {}
	let press_skill_true = {}
	let press_skill_false = {}
	let press = true
	let detonate_skill_id = 420101
	let tb_packet = {}
	let apex_cancel_packet = {}
	let domacro = false
	let combo_targets = []
	let combo_endpoints = []
	let deto_target
	let deto_dest
	let brawler_packet = {}
	let meme = false
	let focused = false
	let targetaim = null
	let targetloc = null
	let guilds_to_block = []
	let guilds_to_focus = []
	let focusguild = false
	let players_to_focus = []
	let focusplayer = false
	let blockguild = false
	let ignore_impregnable = true
	let block_hit = true
	let packet_sent = false
	let BFid
	let packet_loc
	let CD_brooch = 30000
	let CD_beer = 6000
	let isCD_brooch = false
	let isCD_beer = false
	let beerID = 80081
	let broochID
	let lance_cd = false
	let CD_lance
	let cancel_type = 4
	let id
	let cancelled = false
	let rreset = false
	
	
	
	const impregnable_weapon_ids = [90401, 90402, 90403, 90404, 90405, 90406, 90407, 90408, 90409, 90410, 90411, 90412, 90413]	
	
	mod.command.add('salchy', () => {

		options.enabled = !options.enabled
		mod.command.message(`Salchy's sorc exploit is now ${(options.enabled) ? 'en' : 'dis'}abled.`)

	})
	mod.command.add('mbid', (arg) => {

		arcane_id_mb = arg
		mod.command.message("arcane_id_mb set to: ", arcane_id_mb)

	})	
	
	mod.command.add('boss', () => {

		options.focusboss = true
		options.pvp = false
		options.pve = false
		options.pvx = false		
		mod.command.message(`Arcane pulse will now hit only bosses.`)
	})
	mod.command.add('cancel', (arg) => {

		cancel_type = arg
		mod.command.message("Cancel type set to: " + cancel_type)
	})	

	mod.command.add('pvp', () => {

		options.pvp = true
		options.pve = false
		options.pvx = false
		options.focusboss = false
		mod.command.message(`Arcane pulse will now hit only players.`)
	})
	mod.command.add('pve', () => {

		options.pve = true
		options.pvp = false
		options.pvx = false
		options.focusboss = false
		mod.command.message(`Arcane pulse will now hit only mobs.`)
	})
	mod.command.add('pvx', () => {

		options.pvx = true
		options.pvp = false
		options.pve = false
		options.focusboss = false
		mod.command.message(`Arcane pulse will now hit both mobs and players.`)
	})
	mod.command.add('timescape', () => {

		options.timescape = !options.timescape
		mod.command.message(`Timescape Special Feature is now ${(options.timescape) ? 'en' : 'dis'}abled.`)
	})	

	mod.command.add('blockguild', (arg) => {
		//if(!sorc_enab) return false
		if(arg){
		guilds_to_block.push({guild: arg})
		mod.command.message("Guild " + arg + " added to the list of guilds to block. Check list on console.")
		console.log("Blocked guilds: ", guilds_to_block)
		} else {
		blockguild = !blockguild
		mod.command.message(`Block guild mode is now ${(blockguild) ? 'en' : 'dis'}abled.`)
		}

	})
	mod.command.add('focusguild', (arg) => {
		//if(!sorc_enab) return false
		if(arg){

		guilds_to_focus.push({guild: arg})
		mod.command.message("Guild " + arg + " added to the list of guilds to focus. Check list on console.")
		console.log("Focused guilds: ", guilds_to_focus)
		} else {
		focusguild = !focusguild
		mod.command.message(`Focus guild mode is now ${(focusguild) ? 'en' : 'dis'}abled.`)
		}
	})	

	mod.command.add('focusplayer', (arg) => {
		//if(!sorc_enab) return false
		if(arg){
		let person = people.find(m => m.name === arg)
		if (person) {
			targetaim = person.gameId
			targetloc = person.loc
			focused = true
			var mess = "Player " + person.name + " focused!"
			mod.send("S_CUSTOM_STYLE_SYSTEM_MESSAGE", 1, {
				message: mess,
				style: 54
			})
			mod.send("S_PLAY_SOUND", 1, {
				SoundID: 2023
			})
			mod.command.message("Focusing player " + arg + "." )
		} else {
			mod.command.message("Player " + arg + " not found." )
		}			
		
		} else {
		focusplayer = !focusplayer
		mod.command.message(`Focus player mode is now ${(focusplayer) ? 'en' : 'dis'}abled.`)
		}
	})
	mod.command.add('impreg', () => {
		ignore_impregnable = !ignore_impregnable
		mod.command.message(`ignore_impregnable now ${(ignore_impregnable) ? 'en' : 'dis'}abled.`)
		
	})	

	/*mod.command.add('reload', () => {
		//if(!sorc_enab) return false
		config= reloadModule('./config.js')
		arcaneSpam_delay = config[0].arcaneSpam_delay
		focusguild = config[0].focusguild
		blockguild = config[0].blockguild
		guilds_to_focus = config[0].guilds_to_focus
		guilds_to_block = config[0].guilds_to_block
		ignore_impregnable = config[0].ignore_impregnable
		focusplayer = config[0].focusplayer
		players_to_focus = config[0].players_to_focus
		pvp = config[0].pvp
		pve = config[0].pve
		focusboss = config[0].focusboss
		pvx = config[0].pvx
		mod.command.message(`Configuration reloaded.`)
	})*/	
	
	mod.hook('S_LOGIN', 14, (event) => {
		cid = event.gameId
		model = event.templateId
		job = (model - 10101) % 100
		sorc_enab = [sorc_job].includes(job)
		monsters = []
		people = []
		bossid = null
		bossloc = null
		domacro = false
		mod.clearAllIntervals()
		meme = false
	})

	mod.hook('S_PLAYER_CHANGE_STAMINA', 1, (event) => {

		if((event.current<=60) && (job==9)) mod.clearAllIntervals()

	})
	
	mod.hook('S_LOAD_TOPO', 3, event => {
		mod.clearAllIntervals()
		meme = false
		monsters = []
		people = []
		bossid = null
		bossloc = null
		domacro = false
		focused = false
		targetaim = null
		targetloc = null
		broochID = mod.game.inventory.equipment.slots[20];
		//console.log("Brooch: ", broochID)
		if(bugme) {
			bugme = false
			mod.send('S_ABNORMALITY_END', 1, {
				target: cid,
				id: 2060
			})
		}
		
		
	})
	mod.hook('S_EACH_SKILL_RESULT', 15, (event) => {
		if(!options.enabled) return
		if(!options.focusplayer) return
		if(event.type != 1) return
		if(event.source != cid || event.target == cid) return
		let person = people.find(m => m.gameId === event.target)
		if (person) {
			targetaim = person.gameId
			targetloc = person.loc
			focused = true
			var mess = "Player " + person.name + " focused"
			mod.send("S_CUSTOM_STYLE_SYSTEM_MESSAGE", 1, {
				message: mess,
				style: 54
			})
			mod.send("S_PLAY_SOUND", 1, {
				SoundID: 2023
			})			
		}		
	})	
	mod.hook('C_START_INSTANCE_SKILL', 7, (event) => {
		//broochID = mod.game.inventory.equipment.slots[20];
		mod.clearAllIntervals()
		meme = false
		cancelanim = false
		domacro = false
		if((event.skill.id === 11200) && options.enabled && sorc_enab) {
			if(options.auto_dc && people.length != 0) return
			/*if(options.focusboss && bossid && bossloc) {
				event.targets[0].gameId = bossid
				event.endpoints[0] = bossloc
			}*/			
			endp = event.endpoints
			etarg = event.targets
			//event.skill.id = 330112
			if(options.macro) {
				cancelanim = true
				meme = true
				mod.setInterval(arcaneSpam, options.arcaneSpam_delay)
				return false
			} else {
				return true
			}
		}
			/*if(options.focusboss && bossid && bossloc) {
				event.loc = bossloc
				event.targets[0].gameId = bossid
				event.endpoints[0] = bossloc
			}*/		
	})
	mod.hook('S_ABNORMALITY_BEGIN', 5, (event) => {
		if(sorc_enab && event.target==cid && event.id==mb_abnormality_id) {
			MB_active = true
		}
	})
	mod.hook('S_ABNORMALITY_END', 1, (event) => {
		if(sorc_enab && event.target==cid && event.id==mb_abnormality_id) {
			MB_active = false
		}		
	})
	mod.hook('S_ABNORMALITY_REFRESH', 2, (event) => {
		if(sorc_enab && event.target==cid && event.id==mb_abnormality_id) {
			MB_active = true
		}		
	})	
	

	mod.hook('C_START_COMBO_INSTANT_SKILL', 6, { order: -1000 }, (event) => {
		//broochID = mod.game.inventory.equipment.slots[20];
		mod.clearAllIntervals()
		meme = false
		domacro = false
		if((Math.floor(event.skill.id/10000)==5) && options.enabled && (job==9) && options.macroburstfire) {
			combo_targets = event.targets
			combo_endpoints = [myPosition]
			/*if(options.focusboss && options.tptoboss && (bossid!=null)) {
				event.loc = bossloc
				combo_targets = [{ arrowId: 0, gameId: bossid, hitCylinderId: 0}] 
				combo_endpoints = [bossloc]
			}*/
			domacro = true
			BFid = 51021
			/*switch (event.skill.id) {
				case 51010:
					BFid = 51011
					break
				case 51011:
					BFid = 51011
					break					
				case 51020:
					BFid = 51021
					break
				case 51021:
					BFid = 51021
					break
				default:
					BFid = 51021
					break					
			}*/
			mod.setInterval(burstFire, options.burstFire_delay)
			return false
		}
	})
	
	mod.hook('C_PRESS_SKILL', 4, { order: -1000 }, event => {
			if(!enabled) return;	
			if(bugme) {
				packet.loc.z = zbug
				return true;
			}									
	})

	mod.hook('C_START_INSTANCE_SKILL_EX', 5, { order: -1000 },(event) => {
			if(options.focusboss && bossid && bossloc) {
				event.dest = bossloc
				if(bugme) {
					event.loc.z = zbug
				}
				return true
			}
	})		
	
	mod.hook('C_START_SKILL', 7, { order: -1000 },(event) => {
			//broochID = mod.game.inventory.equipment.slots[20]
			if(!options.enabled) return
			if(options.detonatemacro && (event.skill.id == 100930) && (job==9)) return false
			if(options.enabled && (event.skill.id == 41210) && sorc_enab) return false
			mod.clearAllIntervals()
			meme = false
			cancelanim = false
			domacro = false
			if(options.detonatemacro && ((Math.floor(event.skill.id/10000)==1) || (Math.floor(event.skill.id/10000)==42)) && (job==9)) {
				/*if(options.focusboss && bossid && bossloc) {
				deto_target = bossid
				deto_dest = bossloc					
				} else {*/
				deto_target = event.target
				deto_dest = event.dest
				//}
				domacro = true
				mod.setInterval(detonateMacro, options.detonate_delay)	
				return false
			}
			if((Math.floor(event.skill.id/10000)==1) && (job==11) && options.macroninja) {
				endp = [event.dest]
				etarg = [
					{
						arrowId: 0,
						gameId: event.target,
						hitCylinderId:0
					}
				]
				event.skill.id = 150732	
				mod.setInterval(ninjaSpam, options.ninjaSpam_delay)
				return false				
			}
			if((event.skill.id === 9100100) && (job==10) && options.macrobrawler) {
				endp = [event.dest]
				etarg = [
					{
						arrowId: 0,
						gameId: event.target,
						hitCylinderId:0
					}
				]
				mod.setInterval(brawlerSpam, options.brawlerSpam_delay)
				return false				
			}
			/*if(options.focusboss && bossid && bossloc) {
				event.loc = bossloc
				//event.target = bossid
				event.dest = bossloc
				if(bugme) {
					event.loc.z = zbug
				}
				return true
			}*/
			if(bugme) {
				event.loc.z = zbug
				return true
			}									
	})	
	mod.hook('C_PLAYER_LOCATION', 5, (event) => {

		myPosition = event.loc
		myAngle = event.w
		packet_loc = event
		if(bugme) {
			mod.send('C_PLAYER_LOCATION', 5, Object.assign({}, packet_loc, { loc: {x: myPosition.x, y: myPosition.y, z: zbug }, dest: {x: myPosition.x, y: myPosition.y, z: zbug }  }));
			return false
		}
	})
	mod.hook('S_SPAWN_NPC', 12, event => {

		//if(options.timescape && (event.templateId < 1000) && (event.templateId != 241)) return
		//if(event.aggressive==false) return
		monsters.push({ gameId: event.gameId, loc: event.loc })
	})
	mod.hook('S_BOSS_GAGE_INFO', 3, event => {

		if(bossid && bossid == event.id) return
		bossid = event.id
		mod.send("S_CUSTOM_STYLE_SYSTEM_MESSAGE", 1, {
			message: "Boss detected",
			style: 54
		})
		mod.send("S_PLAY_SOUND", 1, {
			SoundID: 2023
		})		
		let monster = monsters.find(m => m.gameId === event.id)
		if (monster) bossloc = monster.loc		
				
		
	})
	mod.hook('S_SPAWN_USER', 17, (event) => {
		if(event.guildName == "Britney Spears") return
		if(options.auto_dc && meme) {
			mod.clearAllIntervals()
		}
		if (party.length != 0) {
			let member = party.find(m => m.gameId == event.gameId)
			if (member) {
				member.gameId = event.gameId
				member.loc = event.loc
				return
			}
		}
		people.push({
			gameId: event.gameId,
			loc: event.loc,
			w: event.w,
			guild: event.guildName,
			name: event.name,
			weapon: event.weapon
		})
	})	

	mod.hook('S_USER_LOCATION', 6, (event) => {

		let member = party.find(m => m.gameId === event.gameId)
		if (member) member.loc = event.loc
		let jugador = people.find(m => m.gameId === event.gameId)
		if (jugador) jugador.loc = event.loc
		if(targetaim == event.gameId) targetloc = event.loc
	})
	mod.hook('S_USER_EXTERNAL_CHANGE', 7, (event) => {
		let jugador = people.find(m => m.gameId === event.gameId)
		if (jugador) jugador.weapon = event.weapon
	})	
	mod.hook('S_VOTE_RESET_ALL_DUNGEON', 1, (event) => {
		mod.send('C_ANSWER_RESET', 1, {
			result: true
		})
    })
	mod.hook('S_NPC_LOCATION', 3, event => {

		let monster = monsters.find(m => m.gameId === event.gameId)
		if (monster) monster.loc = event.loc
		if(bossid == event.gameId) bossloc = event.loc		
	})
	mod.hook('S_DESPAWN_NPC', 3, event => {

		monsters = monsters.filter(m => m.gameId != event.gameId)
		if(bossid == event.gameId) { 
			bossid = null
			bossloc = null
			mod.clearAllIntervals()
			meme = false
		}	
	})
	mod.hook('S_DESPAWN_USER', 3, (event) => {
		people = people.filter(m => m.gameId != event.gameId)
		if(targetaim == event.gameId) {
			targetaim = null
			targetloc = null
			focused = false
			var messs = "Player focused despawned"
			mod.send("S_CUSTOM_STYLE_SYSTEM_MESSAGE", 1, {
				message: messs,
				style: 54
			})
			mod.send("S_PLAY_SOUND", 1, {
				SoundID: 2023
			})				
		}
	})	
	mod.hook('S_DEAD_LOCATION', 2, (event) => {
		
		if(targetaim == event.gameId) {
			targetaim = null
			targetloc = null
			focused = false
			var messss = "Player focused died"
			mod.send("S_CUSTOM_STYLE_SYSTEM_MESSAGE", 1, {
				message: messss,
				style: 54
			})
			mod.send("S_PLAY_SOUND", 1, {
				SoundID: 2023
			})				
		}
	})	
	mod.hook('S_ACTION_STAGE', 9, event => {
		if(targetaim == event.gameId) targetloc = event.loc
		if(bossid == event.gameId) bossloc = event.loc
		if(event.gameId == cid && options.enabled && sorc_enab && cancelanim) return false
		/*if(event.gameId == cid && options.enabled && event.skill.id == arcane_id && sorc_enab && cancelanim) {
								id = event.id
								cancelled = true
								let end_packet = {
									gameId: cid,
									loc: event.loc,
									w: event.w,
									templateId: model,
									skill: event.skill,
									type: cancel_type,
									id: event.id
								}
								mod.send('S_ACTION_END', 5, end_packet)			
			
		}*/
		if(event.gameId == cid && options.enabled && ((event.skill.id == detonate_skill_id) || (event.skill.id == 51021)) && (job==9) && options.macronoanimation && domacro) return false
		if(event.gameId == cid && options.enabled && (event.skill.id == 150732) && (job==11) && options.macronoanimation) return false
		if(event.gameId == cid && options.enabled && (event.skill.id == 260103) && (job==10) && options.macronoanimation) return false
		/*if(event.gameId == cid && (Math.floor(event.skill.id/10000)==5) && options.enabled && (job==9) && options.macroburstfire) {
			mod.send('S_ACTION_END', 5, {		
				gameId: cid,				
				loc: event.loc,	
				w: event.w,
				templateId: event.templateId,			
				skill: event.skill,
				type: 4,
				id: event.id
			})
		}*/
		if(event.gameId == cid && options.enabled && bugme) {
			event.loc.z = zbug - options.zval
			return true
		}
		
	})
	mod.hook('S_ACTION_END', 5, event => {
		if(targetaim == event.gameId) targetloc = event.loc
		if(bossid == event.gameId) bossloc = event.loc
		/*if(event.gameId==cid && event.id==id && cancelled) {
			cancelled = false
			return false
		}*/		
		//if(event.gameId == cid && options.enabled && event.skill.id == arcane_id && sorc_enab && cancelanim) return false
		if(event.gameId == cid && options.enabled && sorc_enab && cancelanim) return false
		if(event.gameId == cid && options.enabled && ((event.skill.id == detonate_skill_id) || (event.skill.id == 51021)) && (job==9) && options.macronoanimation && domacro) return false
		if(event.gameId == cid && options.enabled && (event.skill.id == 260103) && (job==10) && options.macronoanimation) return false
		//if(event.gameId == cid && (Math.floor(event.skill.id/10000)==5) && options.enabled && (job==9) && options.macroburstfire) return false
		if(event.gameId == cid && options.enabled && bugme) {
			event.loc.z = zbug - options.zval
			return true
		}		
	})
	mod.hook('S_USER_LOCATION_IN_ACTION', 2, event => {
		if(targetaim == event.gameId) targetloc = event.loc		
	})	
	mod.hook('S_PARTY_MEMBER_LIST', 9, (event) => {
		const copy = party
		party = event.members.filter(m => m.playerId != mod.game.me.playerId)
		if (copy) {
			for (let i = 0; i < party.length; i++) {
				const copyMember = copy.find(m => m.playerId == party[i].playerId)
				if (copyMember) {
					party[i].gameId = copyMember.gameId
					if (copyMember.loc) party[i].loc = copyMember.loc
				}
			}
		}
	})
	mod.hook('S_LEAVE_PARTY', 1, (event) => {
		party = []
	})
	mod.hook('S_LEAVE_PARTY_MEMBER', 2, (event) => {
		party = party.filter(m => m.playerId != event.playerId)
	})	
	mod.hook('S_START_USER_PROJECTILE', 9, event => {

		if(!options.enabled) return
		if(event.gameId != cid) return
		if(!options.autoaim) return
		if(options.enabled && options.autoaim && options.focusplayer && !focused) return
		let targets = []		
		
		if(options.focusboss && bossid) {
			//targets = [{gameId: bossid}]
			targets.push({
				gameId: bossid
			})			
		}
		if(options.pve) {		
			for(let monster of monsters) {
				//if (getDistance(myPosition, monster.loc) < options.distance*30) {
					targets.push({
						gameId: monster.gameId
					})					
				//}
			}
		}
		if(options.pvp) {
			if(focusplayer) {
				if (getDistance(myPosition, targetloc) < options.distance*30) {
					targets.push({
						gameId: targetaim
					})
				}				
			} else {
				for(let person of people) {					
						if (blockguild) {
							if (guilds_to_block.includes(person.guild)) continue
						}
						if (focusguild) {
							if (!guilds_to_focus.includes(person.guild)) continue
						}
						if (ignore_impregnable) {
							if (impregnable_weapon_ids.includes(person.weapon)) continue
						}					
					if (getDistance(myPosition, person.loc) < options.distance*30) {
						targets.push({
							gameId: person.gameId
						})
					}
				}
			}
		}		
		if(options.pvx) {
			if(focusplayer) {
				if (getDistance(myPosition, targetloc) < options.distance*30) {
					targets.push({
						gameId: targetaim
					})
				}				
			} else {			
				for(let monster of monsters) {
					if (getDistance(myPosition, monster.loc) < options.distance*30) {
						targets.push({
							gameId: monster.gameId
						})					
					}
				}
				for(let person of people) {					
					if (blockguild) {
						if (guilds_to_block.includes(person.guild)) continue
					}
					if (focusguild) {
						if (!guilds_to_focus.includes(person.guild)) continue
					}
					if (ignore_impregnable) {
						if (impregnable_weapon_ids.includes(person.weapon)) continue
					}					
					if (getDistance(myPosition, person.loc) < options.distance*30) {
						targets.push({
							gameId: person.gameId
						})
					}
				}
			}			
			
		}
		if(!targets[0]) {
			block_hit = false
			return
		} else {
			block_hit = true
			mod.send('S_START_USER_PROJECTILE', 9, event)
			if(options.focusplayer && focused && (targetaim != null) && (targetloc != null)) {
				targets.push({
					gameId: targetaim
				})
				event.loc = targetloc
			}
			mod.send('C_HIT_USER_PROJECTILE', 4, {
				id: event.id,
				end: event.end,
				loc: (options.tptoboss && (bossid != null) && (bossloc != null)/* && (getDistance(myPosition, bossloc) < 30*30)*/) ? bossloc : event.loc,
				targets: targets
			})			
			return false	
		}
	})
	mod.hook('C_HIT_USER_PROJECTILE', 4, event => {
		if(options.enabled && options.autoaim && options.focusplayer && !focused) return
		if((options.enabled) && (options.autoaim) && block_hit) return false 
	})	
		
	
	mod.hook('C_USE_ITEM', 3, event => {

		if (!options.enabled) return
		if (event.id == 6560) {
			bugme = !bugme
			if (bugme == true) {
					zbug = myPosition.z + options.zval
				
				mod.send('S_ABNORMALITY_BEGIN', 5, {
					target: cid,
					source: cid,
					id: 2060,
					duration: 0x7FFFFFFF,
					unk: 0,
					stacks: 1,
					unk2: 0,
					unk3: 0
				})
				mod.send('C_PLAYER_LOCATION', 5, Object.assign({}, packet_loc, { loc: {x: myPosition.x, y: myPosition.y, z: zbug }, dest: {x: myPosition.x, y: myPosition.y, z: zbug } }));	
			}
			if (bugme == false) {
				mod.send('S_ABNORMALITY_END', 1, {
					target: cid,
					id: 2060
				})
				mod.toClient('S_INSTANT_MOVE', 3, {
					id: cid,
					x: myPosition.x,
					y: myPosition.y,
					z: myPosition.z,
					w: myAngle
				})
				mod.send('C_PLAYER_LOCATION', 5, Object.assign({}, packet_loc, { loc: {x: myPosition.x, y: myPosition.y, z: (zbug - options.zval) }, dest: {x: myPosition.x, y: myPosition.y, z: (zbug - options.zval) } }));
			}
			mod.command.message('Invincible mode : ' + bugme)
			return false
		}
	})
	
	mod.hook('S_START_COOLTIME_SKILL', 3, event => {
		if (event.skill.id == 340200 && sorc_enab && !mana_boost_cd) {
			mana_boost_cd = true
			CD_mana = event.cooldown
			setTimeout(function () {
				mana_boost_cd = false
			}, CD_mana)
		}
		if (event.skill.id == 270900 && sorc_enab && !hail_cd) {
			hail_cd = true
			CD_hail = 22000
			setTimeout(function () {
				hail_cd = false
			}, CD_hail)
		}
		if (event.skill.id == 350100 && sorc_enab && !lance_cd) {
			lance_cd = true
			CD_lance = event.cooldown
			setTimeout(function () {
				lance_cd = false
			}, CD_lance)
		}	
        if (event.skill.id == 260100 && sorc_enab && !tp_cd) {
			tp_cd = true
			CD_tp= event.cooldown
			setTimeout(function () {
				tp_cd = false
			}, CD_tp)
		}				
	})

	mod.hook('S_START_COOLTIME_ITEM', 1, event => {
		if (event.item == beerID && !isCD_beer) {
			isCD_beer = true
			CD_beer = ( event.cooldown * 1000 )
			setTimeout(function () {
				isCD_beer = false
			}, CD_beer)
		}
		if (event.item == broochID.id && !isCD_brooch) {
			isCD_brooch = true
			CD_brooch = ( event.cooldown * 1000 )
			setTimeout(function () {
				isCD_brooch = false
			}, CD_brooch)
		}			
	})	
		
    function arcaneSpam() {
		packet_sent = false
			/*arcane_packet = {	
				skill: {
					reserved: 0,
					npc: false,
					type: 1,
					huntingZoneId: 0,
					id: arcane_id
				},
				loc: {
						x: myPosition.x,
						y: myPosition.y,
						z: bugme ? zbug : myPosition.z
					},
				w: myAngle,
				continue: false,
				targets: etarg,
				endpoints: [
					{			
					x: myPosition.x, 
					y: myPosition.y,
					z: bugme ? zbug : myPosition.z
					}			
				]
				//endpoints: endp			
			}*/
				arcane_packet = {
					skill: {
						reserved: 0,
						npc: false,
						type: 1,
						huntingZoneId: 0,
						id: MB_active ? arcane_id_mb : arcane_id
					},
					w: myAngle,
					loc: {
							x: myPosition.x,
							y: myPosition.y,
							z: bugme ? zbug : myPosition.z
						},
					dest: {			
						x: bossloc ? bossloc.x : myPosition.x,
						y: bossloc ? bossloc.y : myPosition.y,
						z: bugme ? zbug : myPosition.z
					},
					unk: true,
					moving: false,
					continue: true,
					target: 0,
					unk2: true						
				}
				press_skill_true = {
					skill: {
						reserved: 0,
						npc: false,
						type: 1,
						huntingZoneId: 0,
						id: 41200
					},
					press: false,
					loc: {
							x: myPosition.x,
							y: myPosition.y,
							z: bugme ? zbug : myPosition.z
						},
					w: myAngle					
				}
				press_skill_false = {
					skill: {
						reserved: 0,
						npc: false,
						type: 1,
						huntingZoneId: 0,
						id: 41200
					},
					press: false,
					loc: {
							x: myPosition.x,
							y: myPosition.y,
							z: bugme ? zbug : myPosition.z
						},
					w: myAngle					
				}				
			/*mb_packet = {
				skill: {
					reserved: 0,
					npc: false,
					type: 1,
					huntingZoneId: 0,
					id: 340200
				},
				loc: {
					x: myPosition.x,
					y: myPosition.y,
					z: bugme ? zbug : myPosition.z
				},
				w: myAngle,
				continue: false,
				targets: [{
					arrowId: 0,
					gameId: 0,
					hitCylinderId: 0
				}],
				endpoints: [
					{			
					x: myPosition.x,
					y: myPosition.y,
					z: bugme ? zbug : myPosition.z
					}			
				]
			}*/
				mb_packet = {
					skill: {
						reserved: 0,
						npc: false,
						type: 1,
						huntingZoneId: 0,
						id: 340230
					},
					w: myAngle,
					loc: {
							x: myPosition.x,
							y: myPosition.y,
							z: bugme ? zbug : myPosition.z
						},
					dest: {			
						x: myPosition.x,
						y: myPosition.y,
						z: bugme ? zbug : myPosition.z
					},
					unk: true,
					moving: true,
					continue: true,
					target: 0,
					unk2: false						
				}			
			/*hail_packet = {	
				skill: {
					reserved: 0,
					npc: false,
					type: 1,
					huntingZoneId: 0,
					id: hail_id
				},
				loc: {
						x: myPosition.x,
						y: myPosition.y,
						z: bugme ? zbug : myPosition.z
					},
				w: myAngle,
				continue: false,
				targets: etarg,
								endpoints: [
					{			
					x: myPosition.x,
					y: myPosition.y,
					z: myPosition.z
					}			
				]
			}*/
				hail_packet = {
					skill: {
						reserved: 0,
						npc: false,
						type: 1,
						huntingZoneId: 0,
						id: hail_id
					},
					w: myAngle,
					loc: {
							x: myPosition.x,
							y: myPosition.y,
							z: bugme ? zbug : myPosition.z
						},
					dest: {			
						x: bossloc ? bossloc.x : myPosition.x,
						y: bossloc ? bossloc.y : myPosition.y,
						z: bugme ? zbug : myPosition.z
					},
					unk: true,
					moving: true,
					continue: true,
					target: 0,
					unk2: false						
				}			
			if(bossid!=null && bossloc!=null) {
				lance_packet = {
					skill: {
						reserved: 0,
						npc: false,
						type: 1,
						huntingZoneId: 0,
						id: 350100
					},
					w: myAngle,
					loc: {
							x: myPosition.x,
							y: myPosition.y,
							z: bugme ? zbug : myPosition.z
						},
					dest: {			
						x: myPosition.x,
						y: myPosition.y,
						z: myPosition.z
					},
					unk: true,
					moving: false,
					continue: false,
					target: 0,
					unk2: false						
				}
			}
			
			tp_packet = {
					skill: {
						reserved: 0,
						npc: false,
						type: 1,
						huntingZoneId: 0,
						id: tp_id
					},
					w: myAngle,
					loc: {
							x: myPosition.x,
							y: myPosition.y,
							z: bugme ? zbug : myPosition.z
						},
					dest: {			
						x: bossloc ? bossloc.x : myPosition.x,
						y: bossloc ? bossloc.y : myPosition.y,
						z: bugme ? zbug : myPosition.z
					},
					unk: true,
					moving: true,
					continue: true,
					target: 0,
					unk2: false						
				}			
			if(bossid!=null && bossloc!=null) {
				tp_packet = {
					skill: {
						reserved: 0,
						npc: false,
						type: 1,
						huntingZoneId: 0,
						id: 260100
					},
					w: myAngle,
					loc: {
							x: myPosition.x,
							y: myPosition.y,
							z: bugme ? zbug : myPosition.z
						},
					dest: {			
						x: myPosition.x,
						y: myPosition.y,
						z: myPosition.z
					},
					unk: true,
					moving: false,
					continue: false,
					target: 0,
					unk2: false						
				}
			}
			
			let cancel_skill_packet = {
					skill: {
						reserved: 0,
						npc: false,
						type: 1,
						huntingZoneId: 0,
						id: arcane_id
					},
					type: cancel_type
			}
	
		
			
		//if(!options.automanaboost && !options.autohail) mod.send('C_START_INSTANCE_SKILL', 7, arcane_packet)
		
		
			//if(!MB_active) {
				if(press) {
					mod.send('C_PRESS_SKILL', 4, press_skill_true)
					press = false
				}
				if(!press) {
					mod.send('C_PRESS_SKILL', 4, press_skill_false)
					press = true
				}
			//}			
			
		
		
		
			if(options.automanaboost && !mana_boost_cd && !packet_sent) {
			   packet_sent = true	
						   //mod.send('C_START_INSTANCE_SKILL', 7, mb_packet)
						   mod.send('C_START_SKILL', 7, mb_packet)
				/*setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, mb_packet)}, 25)
				setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, mb_packet)}, 50)
				setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, mb_packet)}, 75)
				setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, mb_packet)}, 100)*/			
			}
			if(!lance_cd && bossid!=null && bossloc!=null) mod.send('C_START_SKILL', 7, lance_packet)
			if(options.autohail && !hail_cd && !packet_sent) {
				packet_sent = true
						   //mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)
						   mod.send('C_START_SKILL', 7, hail_packet)
				/*setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)}, 25)
				setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)}, 50)
				setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)}, 75)
				setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)}, 100)*/
			}
			if(options.autotp && !tp_cd && !packet_sent) {
				packet_sent = true
						   //mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)
						   mod.send('C_START_SKILL', 7, tp_packet)
				/*setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, tp_packet)}, 25)
				setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, tp_packet)}, 50)
				setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, tp_packet)}, 75)
				setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, tp_packet)}, 100)*/
			}
			if(!packet_sent) {
				packet_sent = true
				//mod.send('C_START_INSTANCE_SKILL', 7, arcane_packet)
				mod.send('C_START_SKILL', 7, arcane_packet)
				//mod.send('C_CANCEL_SKILL', 3, cancel_skill_packet)
			}
			if(!isCD_brooch && options.autobrooch) {
						mod.toServer('C_USE_ITEM', 3, {
							gameId: cid,
							id: broochID.id,
							dbid: broochID.dbid,
							target: 0,
							amount: 1,
							dest: {x: 0, y: 0, z: 0},
							loc: {
								x: myPosition.x,
								y: myPosition.y,
								z: bugme ? zbug : myPosition.z
							},
							w: myAngle,
							unk1: 0,
							unk2: 0,
							unk3: 0,
							unk4: 1
						})			
			}
			if(!isCD_beer && options.autobeer) {
				if (mod.game.inventory.getTotalAmountInBag(beerID) > 0){
					var pivo = mod.game.inventory.findInBag(beerID);
						mod.toServer('C_USE_ITEM', 3, {
							gameId: cid,
							id: pivo.id,
							dbid: pivo.dbid,
							target: 0,
							amount: 1,
							dest: {x: 0, y: 0, z: 0},
							loc: {
								x: myPosition.x,
								y: myPosition.y,
								z: bugme ? zbug : myPosition.z
							},
							w: myAngle,
							unk1: 0,
							unk2: 0,
							unk3: 0,
							unk4: 1
						})
				}					
			}
				
		
	
		
		/*if(!options.automanaboost && !options.autohail) mod.send('C_START_INSTANCE_SKILL', 7, arcane_packet)
		if (options.automanaboost && options.autohail && !mana_boost_cd && !hail_cd) {
			hail_cd = true
			setTimeout(function () {
				hail_cd = false
			}, 20000)
					   mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)
			setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)}, 25)
			setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)}, 50)
			setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)}, 75)
			setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)}, 100)
		}
		if (options.automanaboost && options.autohail && mana_boost_cd && hail_cd) mod.send('C_START_INSTANCE_SKILL', 7, arcane_packet)
		if (options.automanaboost && options.autohail && !mana_boost_cd && hail_cd) mod.send('C_START_INSTANCE_SKILL', 7, mb_packet)
		if (options.automanaboost && options.autohail && mana_boost_cd && !hail_cd) { 
			hail_cd = true
			setTimeout(function () {
				hail_cd = false
			}, 20000)
					   mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)
			setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)}, 25)
			setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)}, 50)
			setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)}, 75)
			setTimeout(function () {mod.send('C_START_INSTANCE_SKILL', 7, hail_packet)}, 100)		
		}
			
		if (!options.automanaboost && options.autohail && !hail_cd) {
			hail_cd = true
			setTimeout(function () {
				hail_cd = false
			}, 20000)			
			mod.send('C_START_INSTANCE_SKILL', 7, hail_packet) 
			
		}
		if (!options.automanaboost && options.autohail && hail_cd) mod.send('C_START_INSTANCE_SKILL', 7, arcane_packet)
			
		if (options.automanaboost && !options.autohail && !mana_boost_cd) mod.send('C_START_INSTANCE_SKILL', 7, mb_packet)
		if (options.automanaboost && !options.autohail &&  mana_boost_cd) mod.send('C_START_INSTANCE_SKILL', 7, arcane_packet)*/
	}
    function ninjaSpam() {									
		arcane_packet = {	
			skill: {
				reserved: 0,
				npc: false,
				type: 1,
				huntingZoneId: 0,
				id: 150732
			},
			loc: {
					x: myPosition.x,
					y: myPosition.y,
					z: bugme ? zbug : myPosition.z
				},
			w: myAngle,
			continue: false,
			targets: etarg,
			endpoints: endp
		}
		if(!isCD_brooch && options.autobrooch) {
					mod.toServer('C_USE_ITEM', 3, {
						gameId: cid,
						id: broochID.id,
						dbid: broochID.dbid,
						target: 0,
						amount: 1,
						dest: {x: 0, y: 0, z: 0},
						loc: {
							x: myPosition.x,
							y: myPosition.y,
							z: bugme ? zbug : myPosition.z
						},
						w: myAngle,
						unk1: 0,
						unk2: 0,
						unk3: 0,
						unk4: 1
					})			
		}
		if(!isCD_beer && options.autobeer) {
			if (mod.game.inventory.getTotalAmountInBag(beerID) > 0){
				var pivo = mod.game.inventory.findInBag(beerID);
					mod.toServer('C_USE_ITEM', 3, {
						gameId: cid,
						id: pivo.id,
						dbid: pivo.dbid,
						target: 0,
						amount: 1,
						dest: {x: 0, y: 0, z: 0},
						loc: {
							x: myPosition.x,
							y: myPosition.y,
							z: bugme ? zbug : myPosition.z
						},
						w: myAngle,
						unk1: 0,
						unk2: 0,
						unk3: 0,
						unk4: 1
					})
			}					
		}		
		mod.send('C_START_INSTANCE_SKILL', 7, arcane_packet)
	}
    function brawlerSpam() {									
		brawler_packet = {	
			skill: {
				reserved: 0,
				npc: false,
				type: 1,
				huntingZoneId: 0,
				id: 260103
			},
			loc: {
					x: myPosition.x,
					y: myPosition.y,
					z: bugme ? zbug : myPosition.z
				},
			w: myAngle,
			continue: true,
			targets: [{
				arrowId: 0,
				gameId: 0,
				hitCylinderId: 0
			}],
			endpoints: [{
					x: 0,
					y: 0,
					z: 0
			}]
		}
		if(!isCD_brooch && options.autobrooch) {
					mod.toServer('C_USE_ITEM', 3, {
						gameId: cid,
						id: broochID.id,
						dbid: broochID.dbid,
						target: 0,
						amount: 1,
						dest: {x: 0, y: 0, z: 0},
						loc: {
							x: myPosition.x,
							y: myPosition.y,
							z: bugme ? zbug : myPosition.z
						},
						w: myAngle,
						unk1: 0,
						unk2: 0,
						unk3: 0,
						unk4: 1
					})			
		}
		if(!isCD_beer && options.autobeer) {
			if (mod.game.inventory.getTotalAmountInBag(beerID) > 0){
				var pivo = mod.game.inventory.findInBag(beerID);
					mod.toServer('C_USE_ITEM', 3, {
						gameId: cid,
						id: pivo.id,
						dbid: pivo.dbid,
						target: 0,
						amount: 1,
						dest: {x: 0, y: 0, z: 0},
						loc: {
							x: myPosition.x,
							y: myPosition.y,
							z: bugme ? zbug : myPosition.z
						},
						w: myAngle,
						unk1: 0,
						unk2: 0,
						unk3: 0,
						unk4: 1
					})
			}					
		}		
		
		mod.send('C_START_INSTANCE_SKILL', 7, brawler_packet)
	}	

    function burstFire(event) {									
		burst_packet = {	
			skill: {
				reserved: 0,
				npc: false,
				type: 1,
				huntingZoneId: 0,
				id: BFid
			},
			loc: {
					x: myPosition.x,
					y: myPosition.y,
					z: bugme ? zbug : myPosition.z
				},
			w: myAngle,
			targets: combo_targets,
			endpoints: combo_endpoints
		}
		mod.send('C_START_COMBO_INSTANT_SKILL', 6, burst_packet)
	}
    function detonateMacro(event) {									
		/*tb_packet = {
			skill: {
				reserved: 0,
				npc: false,
				type: 1,
				huntingZoneId: 0,
				id: detonate_skill_id
			},
			loc: {
				x: myPosition.x,
				y: myPosition.y,
				z: bugme ? zbug : myPosition.z
			},
			w: myAngle,
			continue: true,
			targets: [{
				arrowId: 0,
				gameId: 0,
				hitCylinderId: 0
			}],
			endpoints: [deto_dest]
		}*/
		tb_packet = {
			skill: {
				reserved: 0,
				npc: false,
				type: 1,
				huntingZoneId: 0,
				id: detonate_skill_id
			},
			w: myAngle,
			loc: {
				x: myPosition.x,
				y: myPosition.y,
				z: bugme ? zbug : myPosition.z
			},
			dest: deto_dest,
			unk: false,
			moving: true,
			continue: true,
			target: 0,
			unk2: false
		}		
		apex_cancel_packet = {
			skill: {
				reserved: 0,
				npc: false,
				type: 1,
				huntingZoneId: 0,
				id: 100902
			},
			w: myAngle,
			loc: {
				x: myPosition.x,
				y: myPosition.y,
				z: bugme ? zbug : myPosition.z
			},
			dest: deto_dest,
			unk: false,
			moving: true,
			continue: true,
			target: 0,
			unk2: false
		}
		if(!isCD_brooch && options.autobrooch) {
					mod.toServer('C_USE_ITEM', 3, {
						gameId: cid,
						id: broochID.id,
						dbid: broochID.dbid,
						target: 0,
						amount: 1,
						dest: {x: 0, y: 0, z: 0},
						loc: {
							x: myPosition.x,
							y: myPosition.y,
							z: bugme ? zbug : myPosition.z
						},
						w: myAngle,
						unk1: 0,
						unk2: 0,
						unk3: 0,
						unk4: 1
					})			
		}
		if(!isCD_beer && options.autobeer) {
			if (mod.game.inventory.getTotalAmountInBag(beerID) > 0){
				var pivo = mod.game.inventory.findInBag(beerID);
					mod.toServer('C_USE_ITEM', 3, {
						gameId: cid,
						id: pivo.id,
						dbid: pivo.dbid,
						target: 0,
						amount: 1,
						dest: {x: 0, y: 0, z: 0},
						loc: {
							x: myPosition.x,
							y: myPosition.y,
							z: bugme ? zbug : myPosition.z
						},
						w: myAngle,
						unk1: 0,
						unk2: 0,
						unk3: 0,
						unk4: 1
					})
			}					
		}		
		mod.send('C_START_SKILL', 7, tb_packet);
		mod.send('C_START_SKILL', 7, apex_cancel_packet);
	}	
	
	function getDistance(locA, locB) {
		return Math.sqrt(Math.pow((locA.x - locB.x), 2) + Math.pow((locA.y - locB.y), 2))
	}
}
