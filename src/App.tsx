import React, { useState, useEffect } from 'react';
import { nhlTeamsRecentYearChampionList } from "./data/nhl-teams-recent-year-champion";
import { nhlTeamsYearFoundedList } from "./data/nhl-teams-year-founded";

import './index.css';

interface Team {
    nhlTeamName: string;
    year: string;
}

function App() {
    var [filteredList, setFilteredList] = useState<Array<Team>>([]);

    useEffect(() => {
        onLoad();
    }, [])

    function onLoad(): void {
        var processedRecentChampions: Array<Team> = processData(nhlTeamsRecentYearChampionList);
        var processedTeamsYearFounded: Array<Team> = processData(nhlTeamsYearFoundedList);
        filterTeams(processedRecentChampions, processedTeamsYearFounded);
    }

    function processData(data: string): Array<Team> {
        var nhlTeamArray: Array<Team> = [];
        var lines: string[] = data.split(/\r\n|\n/);
        for (var j=0; j<lines.length; j++) {
            var values: string[] = lines[j].split(','); // Split up the comma seperated values
            var nhlAndYear: Team = { nhlTeamName: values[0], year: values[1]};
            nhlTeamArray.push(nhlAndYear)
        }
        return nhlTeamArray;
    }

    function filterTeams(nhlTeamsChampionDateList: Array<Team>, nhlTeamsYearFoundedList: Array<Team>): void{
        var nhlTeamsNoChampionshipDontStartWithVowel: Array<Team> = [];
        for (i = 0; i < nhlTeamsChampionDateList.length; i++) {
            //Verify there is no championship date supplied
            if (nhlTeamsChampionDateList[i].year === "") {
                //Exclude Teams that have city names that start with a vowel
                if ("A" !== nhlTeamsChampionDateList[i].nhlTeamName.substring(0,1)) {
                    if ("E" !== nhlTeamsChampionDateList[i].nhlTeamName.substring(0,1)) {
                        if ("I" !== nhlTeamsChampionDateList[i].nhlTeamName.substring(0,1)) {
                            if ("O" !== nhlTeamsChampionDateList[i].nhlTeamName.substring(0,1)) {
                                if ("U" !== nhlTeamsChampionDateList[i].nhlTeamName.substring(0,1)) {
                                    nhlTeamsNoChampionshipDontStartWithVowel.push(nhlTeamsChampionDateList[i]);
                                }
                            }
                        }
                    }
                }
            }
        }

        var finalList: Array<Team> = [];
        for (var i = 0; i < nhlTeamsNoChampionshipDontStartWithVowel.length; i++) {
            var nhlTeamWithYearEstablished: Team | undefined = nhlTeamsYearFoundedList.find(entry => entry.nhlTeamName === nhlTeamsNoChampionshipDontStartWithVowel[i].nhlTeamName);
            //Verify the team was found prior to 1990 and is in our list of teams that never won a title.
            if (nhlTeamWithYearEstablished && parseInt(nhlTeamWithYearEstablished.year, 10) < 1990) {
                finalList.push(nhlTeamWithYearEstablished);
            }
        }

        //Sort final list alphabetically
        var t: Team;
        for (var x = 0; x < finalList.length; x++) {
            for (var y = 0; y < finalList.length - x - 1; y++) {
                if (finalList[y].nhlTeamName > finalList[y + 1].nhlTeamName) {
                    t = finalList[y];
                    finalList[y] = finalList[y + 1];
                    finalList[y + 1] = t;
                }
            }
        }

        setFilteredList(finalList);
    }

    return (
        <div>
            <h1 className="text-center uppercase font-bold text-2xl text-[navy] font-['Courier_New'] mt-5">NHL Teams for Purchase</h1>
            <span className="grid grid-cols-1 lg:grid-cols-2 gap-10 font-['Courier_New'] text-base text-[navy] mt-10">
                {filteredList.map((team, index) => {
                    return (
                        <div key={index} className="w-4/5 mx-auto border-[2px] rounded-lg shadow-md shadow-[#222222] border-[black]  text-center p-5">
                            {team.nhlTeamName}
                        </div>
                    )
                })}
            </span> 
        </div>
    );
}

export default App;
