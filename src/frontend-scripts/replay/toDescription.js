import { text, handToText, mapOpt1, capitalize } from '../../../utils';

export default function(snapshot, game, userInfo, hideHand) {
	const { isVotePassed, jas, neins } = game.turns.get(snapshot.turnNum);
	const usernameOf = id => game.usernameOf(id).valueOrElse('');
	const claimToText = claim => (claim.valueOrElse([]).length !== 0 ? claim.valueOrElse(text('player', 'nothing')) : text('player', 'nothing'));
	const claimHandToText = (claim, userInfo) => claimToText(mapOpt1(claim => handToText(claim, userInfo))(claim));
	const gameOverText = supplied => supplied.concat([text(game.winningTeam, capitalize(game.winningTeam) + 's'), text('normal', 'win the game.')]);

	switch (snapshot.phase) {
		case 'candidacy':
			return [text('player', usernameOf(snapshot.presidentId)), text('normal', 'is President')];
		case 'nomination':
			return [
				text('player', usernameOf(snapshot.presidentId)),
				text('normal', 'nominates'),
				text('player', usernameOf(snapshot.chancellorId)),
				text('normal', 'as Chancellor')
			];
		case 'election':
			if (snapshot.gameOver) {
				return gameOverText([text('hitler', 'Hitler'), text('normal', 'is elected.')]);
			} else {
				return [
					text('normal', 'The vote'),
					text('normal', isVotePassed ? 'passes' : 'fails'),
					text('player', jas),
					text('normal', 'to'),
					text('player', neins)
				];
			}
		case 'topDeck':
			if (snapshot.gameOver) {
				return gameOverText([text('normal', 'The game was topdecked.')]);
			}
			return [text('normal', 'The election tracker is maxed')];
		case 'presidentLegislation':
			return [text('player', usernameOf(snapshot.presidentId)), text('normal', 'draws')]
				.concat(hideHand ? [text('player', 'three policies')] : handToText(snapshot.presidentHand, userInfo))
				.concat([text('normal', 'and claims')])
				.concat(claimHandToText(snapshot.presidentClaim, userInfo));
		case 'chancellorLegislation':
			return [text('player', usernameOf(snapshot.chancellorId)), text('normal', 'receives')]
				.concat(hideHand ? [text('player', 'two policies')] : handToText(snapshot.chancellorHand, userInfo))
				.concat([text('normal', 'and claims')])
				.concat(claimHandToText(snapshot.chancellorClaim, userInfo));
		case 'veto':
			return [text('normal', 'The veto'), text('player', snapshot.isVetoSuccessful ? 'succeeds' : 'fails')];
		case 'policyEnaction':
			if (snapshot.gameOver) {
				return gameOverText([
					text('normal', 'The last'),
					text(snapshot.enactedPolicy, capitalize(snapshot.enactedPolicy)),
					text('normal', 'policy is enacted.')
				]);
			} else {
				return [text('normal', 'A'), text(snapshot.enactedPolicy, capitalize(snapshot.enactedPolicy)), text('normal', 'policy is enacted.')];
			}
		case 'investigation':
			const investigator = snapshot.investigatorId ?? snapshot.presidentId;
			if (investigator === snapshot.presidentId) {
				// normal investigation, and reverse investigations before the introduction of "investigatorId"
				return [
					text('player', usernameOf(investigator)),
					text('normal', 'investigates'),
					text('player', usernameOf(snapshot.investigationId)),
					text('normal', 'and claims'),
					claimToText(snapshot.investigationClaim.map(i => text(i, capitalize(i))))
				];
			} else {
				// reverse investigation
				return [
					text('player', usernameOf(snapshot.investigationId)),
					text('normal', 'shows their party to'),
					text('player', usernameOf(investigator)),
					text('normal', 'who claims'),
					claimToText(snapshot.investigationClaim.map(i => text(i, capitalize(i))))
				];
			}
		case 'policyPeek':
			return [text('player', usernameOf(snapshot.presidentId)), text('normal', 'peeks')]
				.concat(hideHand ? [text('player', 'three policies')] : handToText(snapshot.policyPeek, userInfo))
				.concat([text('normal', 'and claims')])
				.concat(claimHandToText(snapshot.policyPeekClaim, userInfo));
		case 'specialElection':
			return [text('player', usernameOf(snapshot.presidentId)), text('normal', 'special elects'), text('player', usernameOf(snapshot.specialElection))];
		case 'execution':
			if (snapshot.gameOver) {
				return gameOverText([text('hitler', 'Hitler'), text('normal', 'is killed.')]);
			} else {
				return [text('player', usernameOf(snapshot.presidentId)), text('normal', 'executes'), text('player', usernameOf(snapshot.execution))];
			}
		case 'assassination':
			return gameOverText([text('hitler', 'Hitler'), text('normal', ' selects to assassinate '), text('normal', usernameOf(snapshot.assassination) + '.')]);
	}
}
