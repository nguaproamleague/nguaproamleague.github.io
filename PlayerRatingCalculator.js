const PlayerRatingCalculator = () => {
  const [stats, setStats] = React.usestate({
    playerName: '',
    position: 'PG',
    gamesPlayed: '',
    totalPoints: '',
    totalAssists: '',
    totalRebounds: '', 
    totalSteals: '',
    totalBlocks: '',
    totalTurnovers: '',
    totalFouls: '',
    currentRating: null
  });
  
  const [rating, setRating] = React.usestate(null);
  const [positionDescription, setPositionDescription] = React.usestate('');
  const [ratingDescription, setRatingDescription] = React.usestate('');
  const [perGameStats, setPerGameStats] = React.usestate(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setStats(prevStats => ({
      ...prevStats,
      [name]: value
    }));
    
    // Update position description when position changes
    if (name === 'position') {
      updatePositionDescription(value);
    }
  };
  
  const updatePositionDescription = (position) => {
    switch (position) {
      case 'PG':
        setPositionDescription('Point guards are valued for scoring, assists, steals, and good assist-to-turnover ratio.');
        break;
      case 'SG':
        setPositionDescription('Shooting guards are valued for scoring, some assists, and steals.');
        break;
      case 'SF/Lock':
        setPositionDescription('Lockdown small forwards are valued for steals and scoring.');
        break;
      case 'SF':
        setPositionDescription('Small forwards are valued for balanced contributions in scoring, rebounding, and defense.');
        break;
      case 'PF':
        setPositionDescription('Power forwards are valued for rebounding, scoring, blocks, and steals.');
        break;
      case 'C':
        setPositionDescription('Centers are valued for rebounding, passing, and rim protection.');
        break;
      default:
        setPositionDescription('');
    }
  };
  
  const calculateRating = () => {
    const { position, gamesPlayed, totalPoints, totalAssists, totalRebounds, 
            totalSteals, totalBlocks, totalTurnovers, totalFouls } = stats;
    
    // Convert inputs to numbers, treating empty strings as 0
    const gp = parseFloat(gamesPlayed) || 0;
    const pts = parseFloat(totalPoints) || 0;
    const ast = parseFloat(totalAssists) || 0;
    const reb = parseFloat(totalRebounds) || 0;
    const stl = parseFloat(totalSteals) || 0;
    const blk = parseFloat(totalBlocks) || 0;
    const to = parseFloat(totalTurnovers) || 0;
    const pf = parseFloat(totalFouls) || 0;
    
    // Check if GP is valid
    if (gp <= 0) {
      alert("Games Played must be greater than zero.");
      return;
    }
    
    // Calculate per-game averages
    const pointsPerGame = pts / gp;
    const assistsPerGame = ast / gp;
    const reboundsPerGame = reb / gp;
    const stealsPerGame = stl / gp;
    const blocksPerGame = blk / gp;
    const turnoversPerGame = to / gp;
    const foulsPerGame = pf / gp;
    
    // Store the per-game stats for display
    setPerGameStats({
      pointsPerGame: pointsPerGame.toFixed(1),
      assistsPerGame: assistsPerGame.toFixed(1),
      reboundsPerGame: reboundsPerGame.toFixed(1),
      stealsPerGame: stealsPerGame.toFixed(1),
      blocksPerGame: blocksPerGame.toFixed(1),
      turnoversPerGame: turnoversPerGame.toFixed(1),
      foulsPerGame: foulsPerGame.toFixed(1)
    });
    
    // Start with 0 stars as default
    let rating = 0;
    
    // Basic criteria to achieve 1 star (minimal competence for position)
    if (position === "PG") {
      if ((pointsPerGame >= 10 || assistsPerGame >= 5) && turnoversPerGame < 4) rating = 1;
    } else if (position === "SG") {
      if (pointsPerGame >= 12 && turnoversPerGame < 3) rating = 1;
    } else if (position === "SF/Lock") {
      if (stealsPerGame >= 2 || (pointsPerGame >= 10 && stealsPerGame >= 1)) rating = 1;
    } else if (position === "SF") {
      if ((pointsPerGame >= 8 && stealsPerGame >= 1) || reboundsPerGame >= 4) rating = 1;
    } else if (position === "PF") {
      if ((reboundsPerGame >= 5 || pointsPerGame >= 10) && foulsPerGame < 3) rating = 1;
    } else if (position === "C") {
      if (reboundsPerGame >= 8 || (reboundsPerGame >= 5 && blocksPerGame >= 1)) rating = 1;
    }
    
    // Additional criteria for higher ratings
    if (position === "PG") {
      if (pointsPerGame >= 15 && assistsPerGame >= 6) rating += 1;
      if (pointsPerGame >= 25 && assistsPerGame >= 5) rating += 1;
      
      if (assistsPerGame >= 7) rating += 1;
      if (assistsPerGame >= 10) rating += 1;
      
      // Efficiency adjustments
      const atoRatio = assistsPerGame / Math.max(0.5, turnoversPerGame);
      if (atoRatio >= 3.5) rating += 1;
      if (atoRatio <= 1.5) rating -= 1;
      
      // Defensive impact
      if (stealsPerGame >= 2) rating += 1;
      
      // Turnover issues
      if (turnoversPerGame > 3) rating -= 1;
      if (turnoversPerGame > 4) rating -= 1;
    } 
    else if (position === "SG") {
      if (pointsPerGame >= 15) rating += 1;
      if (pointsPerGame >= 25) rating += 1;
      if (pointsPerGame >= 35) rating += 1;
      
      // Efficiency and playmaking
      if (assistsPerGame > 3 && turnoversPerGame < 1.5) rating += 1;
      if (turnoversPerGame > 2.5) rating -= 1;
      
      // Defensive impact
      if (stealsPerGame >= 2) rating += 1;
    }
    else if (position === "SF/Lock") {
      if (stealsPerGame >= 3) rating += 1;
      if (stealsPerGame >= 4.5) rating += 1;
      
      // Scoring contribution
      if (pointsPerGame >= 15) rating += 1;
      
      // Ball security
      if (turnoversPerGame < 1 && assistsPerGame > 1.5) rating += 1;
      
      // Foul discipline
      if (foulsPerGame > 2.5) rating -= 1;
    }
    else if (position === "SF") {
      if (pointsPerGame >= 12) rating += 1;
      if (pointsPerGame >= 18) rating += 1;
      
      if (reboundsPerGame >= 5) rating += 1;
      
      // Defensive impact
      if (stealsPerGame >= 1.5 || blocksPerGame >= 0.8) rating += 1;
      
      // Playmaking
      if (assistsPerGame >= 3 && turnoversPerGame < 2) rating += 1;
    }
    else if (position === "PF") {
      if (reboundsPerGame >= 6) rating += 1;
      if (pointsPerGame >= 12) rating += 1;
      
      // Defensive impact
      if (blocksPerGame >= 1 || stealsPerGame >= 2) rating += 1;
      
      // Playmaking for position
      if (assistsPerGame >= 3 && turnoversPerGame < 2) rating += 1;
    }
    else if (position === "C") {
      if (reboundsPerGame >= 12) rating += 1;
      if (reboundsPerGame >= 18) rating += 1;
      
      // Playmaking for position
      if (assistsPerGame >= 4) rating += 1;
      if (assistsPerGame >= 7) rating += 1;
      
      // Defensive impact
      if (blocksPerGame >= 1) rating += 1;
      
      // Efficiency
      const atoRatio = assistsPerGame / Math.max(0.5, turnoversPerGame);
      if (atoRatio >= 3.5 && assistsPerGame >= 3) rating += 1;
    }
    
    // Game count penalty (be extremely conservative with fewer games)
    if (gamesPlayed === 1) {
      rating = Math.min(rating, 1); // Cap at 1 star for just 1 game
    } else if (gamesPlayed <= 3) {
      rating = Math.min(rating, 2); // Cap at 2 stars for 2-3 games
    } else if (gamesPlayed <= 5) {
      rating = Math.min(rating, 3); // Cap at 3 stars for 4-5 games
    }
    
    // Even with 6+ games, 5 stars should be nearly impossible
    if (gamesPlayed >= 6) {
      if (position === "PG" && pointsPerGame >= 25 && assistsPerGame >= 9 && stealsPerGame >= 1.5 && turnoversPerGame < 2.5) {
        rating = 5; // Elite PG with scoring, playmaking, and defense
      } else if (position === "C" && reboundsPerGame >= 20 && assistsPerGame >= 8 && blocksPerGame >= 1) {
        rating = 5; // Elite C with rebounding, playmaking, and defense
      } else {
        rating = Math.min(rating, 4); // Otherwise cap at 4 stars
      }
    }
    
    // Special 0-star cases - players with major deficiencies
    if (position === "PG" && (turnoversPerGame > assistsPerGame || (assistsPerGame < 3 && pointsPerGame < 8))) {
      rating = 0; // PG with more TOs than assists, or very low productivity
    } else if (position === "SG" && pointsPerGame < 8 && stealsPerGame < 1) {
      rating = 0; // SG who can't score or defend
    } else if (position === "SF/Lock" && stealsPerGame < 1.5 && pointsPerGame < 8) {
      rating = 0; // Lockdown SF with poor steals and scoring
    } else if (position === "SF" && pointsPerGame < 7 && reboundsPerGame < 3 && stealsPerGame < 1) {
      rating = 0; // SF with poor all-around production
    } else if (position === "PF" && reboundsPerGame < 3 && pointsPerGame < 8 && blocksPerGame < 0.5) {
      rating = 0; // PF with poor rebounding, scoring, and defense
    } else if (position === "C" && reboundsPerGame < 5 && blocksPerGame < 0.5) {
      rating = 0; // C with poor rebounding and rim protection
    }
    
    // Ensure rating is within bounds
    rating = Math.max(0, Math.min(5, rating));
    
    setRating(rating);
    setRatingDescription(getRatingDescription(rating));
  };
  
  const getRatingDescription = (rating) => {
    switch(rating) {
      case 0: 
        return "This player has significant deficiencies in key areas expected from their position.";
      case 1:
        return "This player meets the minimum requirements for their position but doesn't excel.";
      case 2:
        return "This player is a solid rotation piece with some valuable skills.";
      case 3:
        return "This player is a quality starter who contributes significantly in multiple areas.";
      case 4:
        return "This player is an excellent performer, approaching elite status.";
      case 5:
        return "This player is truly elite, demonstrating exceptional performance across all key areas for their position.";
      default:
        return "";
    }
  };
  
  const generatePlayerAnalysis = () => {
    if (!perGameStats) return "";
    
    const { position } = stats;
    const ppg = parseFloat(perGameStats.pointsPerGame);
    const apg = parseFloat(perGameStats.assistsPerGame);
    const rpg = parseFloat(perGameStats.reboundsPerGame);
    const spg = parseFloat(perGameStats.stealsPerGame);
    const bpg = parseFloat(perGameStats.blocksPerGame);
    const topg = parseFloat(perGameStats.turnoversPerGame);
    const pfpg = parseFloat(perGameStats.foulsPerGame);
    
    // Calculate assist-to-turnover ratio
    const atoRatio = topg > 0 ? (apg / topg).toFixed(1) : apg.toFixed(1);
    
    // Determine strengths
    const strengths = [];
    const weaknesses = [];
    
    // General analysis based on position
    if (position === "PG") {
      // PG strengths
      if (ppg >= 20) strengths.push(`Excellent scoring ability (${ppg.toFixed(1)} PPG).`);
      else if (ppg >= 15) strengths.push(`Good scoring ability (${ppg.toFixed(1)} PPG).`);
      
      if (apg >= 9) strengths.push(`Elite playmaking (${apg.toFixed(1)} APG).`);
      else if (apg >= 7) strengths.push(`Very good playmaking (${apg.toFixed(1)} APG).`);
      else if (apg >= 5) strengths.push(`Solid playmaking (${apg.toFixed(1)} APG).`);
      
      if (apg/topg >= 3) strengths.push(`Excellent ball security (${atoRatio}:1 assist-to-turnover ratio).`);
      else if (apg/topg >= 2.2) strengths.push(`Good ball security (${atoRatio}:1 assist-to-turnover ratio).`);
      
      if (spg >= 2) strengths.push(`Excellent defensive disruption (${spg.toFixed(1)} SPG).`);
      else if (spg >= 1.5) strengths.push(`Good defensive presence (${spg.toFixed(1)} SPG).`);
      
      if (pfpg < 1) strengths.push(`Excellent foul discipline (${pfpg.toFixed(1)} fouls per game).`);
      
      // PG weaknesses
      if (ppg < 10) weaknesses.push(`Limited scoring threat (${ppg.toFixed(1)} PPG).`);
      
      if (apg < 4) weaknesses.push(`Below-average playmaking for the position (${apg.toFixed(1)} APG).`);
      
      if (apg/topg < 1.5) weaknesses.push(`Poor ball security (${atoRatio}:1 assist-to-turnover ratio).`);
      else if (topg > 3) weaknesses.push(`High turnover rate (${topg.toFixed(1)} TOPG).`);
      
      if (spg < 0.8) weaknesses.push(`Limited defensive impact (${spg.toFixed(1)} SPG).`);
      
    } else if (position === "SG") {
      // SG strengths
      if (ppg >= 25) strengths.push(`Elite scoring ability (${ppg.toFixed(1)} PPG).`);
      else if (ppg >= 18) strengths.push(`Very good scoring ability (${ppg.toFixed(1)} PPG).`);
      else if (ppg >= 14) strengths.push(`Solid scoring ability (${ppg.toFixed(1)} PPG).`);
      
      if (apg >= 4) strengths.push(`Good playmaking for a shooting guard (${apg.toFixed(1)} APG).`);
      else if (apg >= 3 && topg < 2) strengths.push(`Efficient secondary playmaking (${apg.toFixed(1)} APG, ${topg.toFixed(1)} TOPG).`);
      
      if (spg >= 2) strengths.push(`Excellent defensive disruption (${spg.toFixed(1)} SPG).`);
      else if (spg >= 1.5) strengths.push(`Good defensive presence (${spg.toFixed(1)} SPG).`);
      
      if (pfpg < 1.2) strengths.push(`Good foul discipline (${pfpg.toFixed(1)} fouls per game).`);
      
      // SG weaknesses
      if (ppg < 12) weaknesses.push(`Limited scoring for a shooting guard (${ppg.toFixed(1)} PPG).`);
      else if (ppg < 15 && spg < 1.5) weaknesses.push(`Needs to contribute more either offensively or defensively.`);
      
      if (topg > 2.5) weaknesses.push(`High turnover rate (${topg.toFixed(1)} TOPG).`);
      
      if (spg < 1) weaknesses.push(`Limited defensive impact (${spg.toFixed(1)} SPG).`);
      
    } else if (position === "SF/Lock") {
      // SF/Lock strengths
      if (spg >= 4) strengths.push(`Elite defensive disruption (${spg.toFixed(1)} SPG).`);
      else if (spg >= 3) strengths.push(`Excellent defensive disruption (${spg.toFixed(1)} SPG).`);
      else if (spg >= 2) strengths.push(`Good defensive presence (${spg.toFixed(1)} SPG).`);
      
      if (ppg >= 20) strengths.push(`Exceptional scoring for a lockdown defender (${ppg.toFixed(1)} PPG).`);
      else if (ppg >= 15) strengths.push(`Very good scoring for a lockdown defender (${ppg.toFixed(1)} PPG).`);
      else if (ppg >= 10) strengths.push(`Adequate scoring contribution (${ppg.toFixed(1)} PPG).`);
      
      if (topg < 1) strengths.push(`Excellent ball security (${topg.toFixed(1)} TOPG).`);
      
      if (bpg >= 0.8) strengths.push(`Contributes shot blocking (${bpg.toFixed(1)} BPG).`);
      
      // SF/Lock weaknesses
      if (spg < 2) weaknesses.push(`Below-average steal rate for a lockdown defender (${spg.toFixed(1)} SPG).`);
      
      if (ppg < 8) weaknesses.push(`Limited offensive contribution (${ppg.toFixed(1)} PPG).`);
      
      if (pfpg > 2.5) weaknesses.push(`High foul rate limits playing time (${pfpg.toFixed(1)} fouls per game).`);
      
    } else if (position === "SF") {
      // SF strengths
      if (ppg >= 20) strengths.push(`Excellent scoring ability (${ppg.toFixed(1)} PPG).`);
      else if (ppg >= 15) strengths.push(`Good scoring ability (${ppg.toFixed(1)} PPG).`);
      
      if (rpg >= 6) strengths.push(`Good rebounding for a wing (${rpg.toFixed(1)} RPG).`);
      
      if (apg >= 4) strengths.push(`Good playmaking for a forward (${apg.toFixed(1)} APG).`);
      
      if (spg >= 1.5) strengths.push(`Good defensive anticipation (${spg.toFixed(1)} SPG).`);
      if (bpg >= 0.8) strengths.push(`Contributes in shot blocking (${bpg.toFixed(1)} BPG).`);
      
      // SF weaknesses
      if (ppg < 10) weaknesses.push(`Limited scoring for a forward (${ppg.toFixed(1)} PPG).`);
      
      // Removed rebounding weakness for SF position
      
      if (spg < 0.8 && bpg < 0.5) weaknesses.push(`Limited defensive impact.`);
      
    } else if (position === "PF") {
      // PF strengths
      if (rpg >= 8) strengths.push(`Excellent rebounding (${rpg.toFixed(1)} RPG).`);
      else if (rpg >= 6) strengths.push(`Solid rebounding (${rpg.toFixed(1)} RPG).`);
      
      if (ppg >= 15) strengths.push(`Very good scoring for a power forward (${ppg.toFixed(1)} PPG).`);
      else if (ppg >= 12) strengths.push(`Good scoring ability (${ppg.toFixed(1)} PPG).`);
      
      if (bpg >= 1.2) strengths.push(`Excellent shot blocking (${bpg.toFixed(1)} BPG).`);
      else if (bpg >= 0.8) strengths.push(`Good rim protection (${bpg.toFixed(1)} BPG).`);
      
      if (spg >= 1.5) strengths.push(`Disruptive defense (${spg.toFixed(1)} SPG).`);
      
      if (apg >= 3) strengths.push(`Good playmaking for a big man (${apg.toFixed(1)} APG).`);
      
      // PF weaknesses
      if (rpg < 5) weaknesses.push(`Below-average rebounding for position (${rpg.toFixed(1)} RPG).`);
      
      if (ppg < 8) weaknesses.push(`Limited scoring contribution (${ppg.toFixed(1)} PPG).`);
      
      if (bpg < 0.5 && spg < 1) weaknesses.push(`Limited defensive impact.`);
      
    } else if (position === "C") {
      // C strengths
      if (rpg >= 15) strengths.push(`Elite rebounding (${rpg.toFixed(1)} RPG).`);
      else if (rpg >= 10) strengths.push(`Very good rebounding (${rpg.toFixed(1)} RPG).`);
      else if (rpg >= 8) strengths.push(`Solid rebounding (${rpg.toFixed(1)} RPG).`);
      
      if (bpg >= 1.5) strengths.push(`Excellent rim protection (${bpg.toFixed(1)} BPG).`);
      else if (bpg >= 1) strengths.push(`Good shot blocking (${bpg.toFixed(1)} BPG).`);
      else if (bpg >= 0.7) strengths.push(`Adequate rim protection (${bpg.toFixed(1)} BPG).`);
      
      if (ppg >= 18) strengths.push(`Excellent scoring for a center (${ppg.toFixed(1)} PPG).`);
      else if (ppg >= 12) strengths.push(`Good scoring contribution (${ppg.toFixed(1)} PPG).`);
      
      if (apg >= 4) strengths.push(`Exceptional passing for a big man (${apg.toFixed(1)} APG).`);
      else if (apg >= 2.5) strengths.push(`Good court vision for a center (${apg.toFixed(1)} APG).`);
      
      if (spg >= 1) strengths.push(`Active hands on defense (${spg.toFixed(1)} SPG).`);
      
      if (pfpg < 1.5) strengths.push(`Good foul discipline for a center (${pfpg.toFixed(1)} fouls per game).`);
      
      // C weaknesses
      if (rpg < 8) weaknesses.push(`Below-average rebounding for a center (${rpg.toFixed(1)} RPG).`);
      
      if (bpg < 0.5) weaknesses.push(`Limited rim protection (${bpg.toFixed(1)} BPG).`);
      
      if (ppg < 8 && apg < 3) weaknesses.push(`Limited offensive impact (${ppg.toFixed(1)} PPG, ${apg.toFixed(1)} APG).`);
      
      if (topg > 2.5) weaknesses.push(`Turnover prone (${topg.toFixed(1)} TOPG).`);
      
      if (pfpg > 3) weaknesses.push(`Foul trouble concerns (${pfpg.toFixed(1)} fouls per game).`);
    }
    
    // Compile the analysis
    let analysis = ``;
    
    // Add strengths section if there are any
    if (strengths.length > 0) {
      analysis += `<h4 class="font-bold mt-3 mb-1">Strengths:</h4><ul class="list-disc pl-5">`;
      strengths.forEach(strength => {
        analysis += `<li>${strength}</li>`;
      });
      analysis += `</ul>`;
    }
    
    // Add weaknesses section if there are any
    if (weaknesses.length > 0) {
      analysis += `<h4 class="font-bold mt-3 mb-1">Weaknesses:</h4><ul class="list-disc pl-5">`;
      weaknesses.forEach(weakness => {
        analysis += `<li>${weakness}</li>`;
      });
      analysis += `</ul>`;
    }
    
    // Add positional summary
    analysis += `<h4 class="font-bold mt-3 mb-1">Summary:</h4>`;
    if (rating === 5) {
      analysis += `<p>This is an elite ${position} who excels in all key areas expected from the position.</p>`;
    } else if (rating === 4) {
      analysis += `<p>This is a high-level ${position} who demonstrates excellence in multiple aspects of the game.</p>`;
    } else if (rating === 3) {
      analysis += `<p>This is a quality ${position} who contributes positively in several important areas.</p>`;
    } else if (rating === 2) {
      analysis += `<p>This is a serviceable ${position} with some notable skills but also clear limitations.</p>`;
    } else if (rating === 1) {
      analysis += `<p>This ${position} meets minimum standards but has significant room for improvement.</p>`;
    } else {
      analysis += `<p>This ${position} has major deficiencies that limit their effectiveness.</p>`;
    }
    
    return analysis;
  };
  
  const renderStars = () => {
    if (rating === null) return null;
    
    // Determine rating change if a current rating was provided
    let ratingChange = null;
    let ratingChangeText = '';
    let ratingChangeColor = '';
    
    if (stats.currentRating !== null && stats.currentRating !== '') {
      const currentRating = parseInt(stats.currentRating);
      if (rating > currentRating) {
        ratingChange = 'increase';
        ratingChangeText = `↑ Rating increased from ${currentRating} to ${rating} stars!`;
        ratingChangeColor = 'text-green-600';
      } else if (rating < currentRating) {
        ratingChange = 'decrease';
        ratingChangeText = `↓ Rating decreased from ${currentRating} to ${rating} stars`;
        ratingChangeColor = 'text-red-600';
      } else {
        ratingChange = 'same';
        ratingChangeText = `→ Rating unchanged at ${rating} stars`;
        ratingChangeColor = 'text-blue-600';
      }
    }
    
    return (
      <div className="text-center mt-4">
        <p className="text-xl font-bold">
          Rating: {rating} {rating === 1 ? 'Star' : 'Stars'}
        </p>
        <div className="flex justify-center text-4xl mb-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>★</span>
          ))}
        </div>
        
        {ratingChange && (
          <div className={`mb-3 text-lg font-semibold ${ratingChangeColor}`}>
            {ratingChangeText}
          </div>
        )}
        
        <p className="mt-2 text-lg">{ratingDescription}</p>
      </div>
    );
  };
  
  const handleExampleClick = (example) => {
    // Examples of actual players with their correct stats
    if (example === 'blick') {
      setStats({
        playerName: 'Blick Star',
        position: 'PG',
        gamesPlayed: '19',
        totalPoints: '764',
        totalAssists: '128',
        totalRebounds: '2',
        totalSteals: '66',
        totalBlocks: '0',
        totalTurnovers: '42',
        totalFouls: '36',
        currentRating: '5' // 5-star PG
      });
    } else if (example === 'mhad') {
      setStats({
        playerName: 'TV, Mhad',
        position: 'C',
        gamesPlayed: '6',
        totalPoints: '47',
        totalAssists: '59',
        totalRebounds: '137',
        totalSteals: '6',
        totalBlocks: '6',
        totalTurnovers: '15',
        totalFouls: '5',
        currentRating: '4' // Previously rated 4 stars (now will show increase to 5)
      });
    } else if (example === 'view') {
      setStats({
        playerName: 'View Accounts',
        position: 'SF',
        gamesPlayed: '10',
        totalPoints: '149',
        totalAssists: '28',
        totalRebounds: '8',
        totalSteals: '38',
        totalBlocks: '0',
        totalTurnovers: '7',
        totalFouls: '8',
        currentRating: '5' // 5-star SF
      });
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Basketball Player Star Rating Calculator</h1>
      <p className="mb-4 text-gray-600 text-center">Enter player's season totals to calculate their star rating</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-2">Player Name</label>
          <input
            type="text"
            name="playerName"
            value={stats.playerName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Player Name"
          />
        </div>
        
        <div>
          <label className="block mb-2">Position</label>
          <select
            name="position"
            value={stats.position}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="PG">Point Guard (PG)</option>
            <option value="SG">Shooting Guard (SG)</option>
            <option value="SF">Small Forward (SF)</option>
            <option value="SF/Lock">Lockdown SF (SF/Lock)</option>
            <option value="PF">Power Forward (PF)</option>
            <option value="C">Center (C)</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">{positionDescription}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block mb-2">Games Played (GP)</label>
          <input
            type="number"
            name="gamesPlayed"
            value={stats.gamesPlayed}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>
        
        <div>
          <label className="block mb-2">Total Points (PTS)</label>
          <input
            type="number"
            name="totalPoints"
            value={stats.totalPoints}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>
        
        <div>
          <label className="block mb-2">Total Assists (AST)</label>
          <input
            type="number"
            name="totalAssists"
            value={stats.totalAssists}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>
        
        <div>
          <label className="block mb-2">Total Rebounds (REB)</label>
          <input
            type="number"
            name="totalRebounds"
            value={stats.totalRebounds}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>
        
        <div>
          <label className="block mb-2">Total Steals (STL)</label>
          <input
            type="number"
            name="totalSteals"
            value={stats.totalSteals}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>
        
        <div>
          <label className="block mb-2">Total Blocks (BLK)</label>
          <input
            type="number"
            name="totalBlocks"
            value={stats.totalBlocks}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>
        
        <div>
          <label className="block mb-2">Total Turnovers (TO)</label>
          <input
            type="number"
            name="totalTurnovers"
            value={stats.totalTurnovers}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>
        
        <div>
          <label className="block mb-2">Total Personal Fouls (PF)</label>
          <input
            type="number"
            name="totalFouls"
            value={stats.totalFouls}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>
        
        <div>
          <label className="block mb-2">Current Star Rating (if any)</label>
          <select
            name="currentRating"
            value={stats.currentRating !== null ? stats.currentRating : ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Rating --</option>
            <option value="0">0 Stars</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <button
          onClick={calculateRating}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Calculate Rating
        </button>
      </div>
      
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Try Example Players:</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleExampleClick('blick')}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            Blick Star (PG)
          </button>
          <button 
            onClick={() => handleExampleClick('mhad')}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            TV, Mhad (C)
          </button>
          <button 
            onClick={() => handleExampleClick('view')}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            View Accounts (SF)
          </button>
        </div>
      </div>
      
      {renderStars()}
      
      {perGameStats !== null && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Per-Game Averages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="font-semibold">Points:</span> {perGameStats.pointsPerGame}
            </div>
            <div>
              <span className="font-semibold">Assists:</span> {perGameStats.assistsPerGame}
            </div>
            <div>
              <span className="font-semibold">Rebounds:</span> {perGameStats.reboundsPerGame}
            </div>
            <div>
              <span className="font-semibold">Steals:</span> {perGameStats.stealsPerGame}
            </div>
            <div>
              <span className="font-semibold">Blocks:</span> {perGameStats.blocksPerGame}
            </div>
            <div>
              <span className="font-semibold">Turnovers:</span> {perGameStats.turnoversPerGame}
            </div>
            <div>
              <span className="font-semibold">Fouls:</span> {perGameStats.foulsPerGame}
            </div>
          </div>
        </div>
      )}
      
      {rating !== null && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Player Analysis</h3>
          <div dangerouslySetInnerHTML={{ __html: generatePlayerAnalysis() }} />
          
          <h3 className="font-bold text-lg mt-4 mb-2">Rating Explanation</h3>
          <p>Ratings are based on:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Position-specific performance expectations</li>
            <li>Statistical production relative to position</li>
            <li>Efficiency metrics (like assist-to-turnover ratio)</li>
            <li>Games played (fewer games = more conservative rating)</li>
            <li>Balance of offensive and defensive contributions</li>
          </ul>
          <p className="mt-2">The algorithm uses the same criteria developed through our previous analysis of over 100 players.</p>
        </div>
      )}
    </div>
  );
};

window.PlayerRatingCalculator = PlayerRatingCalculator;
