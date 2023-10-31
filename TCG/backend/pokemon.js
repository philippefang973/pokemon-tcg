module.exports = {
    getSets: async function (number_sets) {
        try {
        const api_key = "3b7b645f-ac8d-4054-8ec6-23f56147d361";
        const url_sets = "https://api.pokemontcg.io/v2/sets";
        const url_cards = "https://api.pokemontcg.io/v2/cards";
        const head = { 'X-Api-Key': api_key };
        
        async function getPokemonSets(number_sets) {
                const req = url_sets+"?orderBy=releaseDate&page=1&select=id,name,series,total";
                const res = await fetch(req, {
                    method: 'GET', 
                    headers: head 
                });
                if (!res.ok) throw new Error('Failed Pokemon API call');
                const data = await res.json();
                return data['data'].slice(0,number_sets);
        }

        async function getPokemonCardsFromSet(set) {
                const req = url_cards+"?q=set.id:"+set["id"]+"&select=name,images";
                const res = await fetch(req, {
                    method: 'GET', 
                    headers: head 
                });
                if (!res.ok) throw new Error('Failed Pokemon API call');
                const data = await res.json();
                var new_list = [];
                for (let card of data['data']) {
                    card['set'] = set['name'];
                    const jsonStr = JSON.stringify(card);
                    const uri = `data:application/json;charset=utf-8,${encodeURIComponent(jsonStr)}`;
                    new_list.push({name:card.name,uri:uri});
                }
                return new_list;
        }

        async function getPokemonData(number_sets) {
            console.log("PokemonAPI: Start");
            const sets = await getPokemonSets(number_sets);
            console.log("Number of sets chosen: "+sets.length);
            const res = {};
            for (const set of sets) {
                console.log("\nSet:"+set["name"]+" | Series:"+set["series"]); 
                console.log("Total cards: "+set["total"]);
                const cards = await getPokemonCardsFromSet(set); 
                res[set["name"]] = cards;   
            };
            console.log("PokemonAPI: End");
            //console.log(res);
            return res;
        }
        return getPokemonData(number_sets);
    } catch (error) {
        console.error(error.message);
        return {};
    }
    },

    getPokemonInfo: async function (id) {
        try {
        const api_key = "3b7b645f-ac8d-4054-8ec6-23f56147d361";
        const url_cards = "https://api.pokemontcg.io/v2/cards";
        const head = { 'X-Api-Key': api_key };

            const res = await fetch(url_cards+"/"+id, {
                method: 'GET', 
                headers: head 
            });
            if (!res.ok) throw new Error('Failed Pokemon API call');
            const data = await res.json();
            return data['data'];
        } catch (error) {
            console.error(error.message);
            return {};
        }
    }
};
