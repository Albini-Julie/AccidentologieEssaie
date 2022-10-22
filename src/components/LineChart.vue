<script setup>
    import {reactive, ref, onMounted} from 'vue';

    //Import d'un graphique typeLineChart
    import {Line} from 'vue-chartjs'

    //Import des ojbets du graphique de la bibliothèque ChartJs
    //Voir documentation pour descriptof des éléments
    import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, LineController, CategoryScale, LinearScale, Filler} from 'chart.js'

    //Elements utilisés par notre graphique registration pour Vue-chart
    ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, LineController, CategoryScale, LinearScale, Filler)

    //Propriétés du graphique utilisés dans le template (props)
    //On définit pour chacune son type de données et sa valeur par défaut
    //On peut utiliser une grande variété de types, voire des objets
    const propChart = defineProps({
        chartId: {type: String,     default: 'line-chart'}, //Id du graphique
        datasetIdKey: {type: String, default: 'label'}, //id du dataSet
        width: {type: Number, default: 200},//Hauteur du graphe
        height: {type: Number, default: 100}, //Largeur du graphe
        cssClasses: {type:String, default:''},//Classes css utilisées
        styles: {type: Object, default: () => {}}, //Styles utilisés
        plugins: {type: Object, default: () => {}}, //plugins utilisés
    });
        //Données injectées dans le graphique
        let chartData = reactive({
            //Etiquette de l'axe
            labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai'],
            //Valeurs de données du graphique
            //3 datasets, en un premier temps les données sont statiques (jeux de test)
            //Elles sont écrasées par les données réelles provenant de l'API
            datasets: [
                {
                    //Etiquette du jeu de doonnées à projeter
                    label : 'Blessés grave',
                    //Valeurs des données (statiques pour l'exemple)
                    data: [40, 20, 12, 14, 24],
                    borderColor: 'rgba(255, 0, 0, 0.5)',
                    tension: 0.5,
                    fill: true,
                    //Points de la courbe
                    pointBackgroundColor: "#DC143C", //Couleur de fond du point
                    pointBorderColor: "#B22222", //Bordure entourant le point
                    pointHoverBackgroundColor: "#B22222", //Couleur de fond du pointau passage de la souris
                    pointHoverBorderColor: "#DC143C", //Bordure entourant le point au passage de la souris
                    pointRadius: 4, //Rayon du point
                    pointHoverRadius: 6, //Rayon du point au passage de la souris
                },
                {
                    //Etiquette du jeu de données à projeter
                    label : 'Blessés légers',
                    //Valeurs des données (statiques pour l'exemple)
                    data: [40, 20, 12, 14, 24],
                    borderColor: 'rgba(0, 0, 255, 0.5)',
                    tension: 0.5,
                    fill: true,

                    //Points de la courbe
                    pointBackgroundColor: "#00BFFF", //Couleur de fond du point
                    pointBorderColor: "#1E90FF", //Bordure entourant le point
                    pointHoverBackgroundColor: "#1E90FF", //Couleur de fond du pointau passage de la souris
                    pointHoverBorderColor: "#00BFFF", //Bordure entourant le point au passage de la souris
                    pointRadius: 4, //Rayon du point
                    pointHoverRadius: 6, //Rayon du point au passage de la souris
                },
                {
                    //Etiquette du jeu de données à projeter
                    label:'Indemnes',
                    //Valeurs des données (statiques pour l'exemple)
                    data: [80, 40, 24, 28, 48],
                    borderColor: 'rgba(255, 255, 0, 0.4)',
                    tension: 0.5,
                    fill: true,

                    //Points de la courbe
                    pointBackgroundColor: "#FFFF00", //Couleur de fond du point
                    pointBorderColor: "#ffb88c", //Bordure entourant le point
                    pointHoverBackgroundColor: "ffb88c", //Couleur de fond du pointau passage de la souris
                    pointHoverBorderColor: "#FFFF00", //Bordure entourant le point au passage de la souris
                    pointRadius: 4, //Rayon du point
                    pointHoverRadius: 6, //Rayon du point au passage de la souris
                },
                {
                    //Etiquette du jeu de doonnées à projeter
                    label : 'Tués',
                    //Valeurs des données (statiques pour l'exemple)
                    data: [40, 20, 12, 14, 24],
                    borderColor: 'rgba(0, 255, 0, 0.5)',
                    tension: 0.5,
                    fill: true,
                    //Points de la courbe
                    pointBackgroundColor: "#00FF00", //Couleur de fond du point
                    pointBorderColor: "#00561B", //Bordure entourant le point
                    pointHoverBackgroundColor: "#00FF00", //Couleur de fond du pointau passage de la souris
                    pointHoverBorderColor: "#00561B", //Bordure entourant le point au passage de la souris
                    pointRadius: 4, //Rayon du point
                    pointHoverRadius: 6, //Rayon du point au passage de la souris
                },
            ]
        });

        //Otpions du graphique
        //Les principales utilisées, ils en existe beaucoup d'autres
        //Voir documentation
        let chartOptions = reactive({
            //Aspect responsive du graphique
            responsive: true,
            //les plugins
            plugins:{
                //titre du graphique
                title: {
                    //Affichage
                    display: true,
                    //Libellé du graphique
                    text: 'Évolution des blessés légers, blessés hospitalisés, personnes indemnes et de tués dans des accidents à vélo entre 2005 et 2018 :',
                    // Police du texte
                    font: {
                        size: 16
                    }
                }
            }
        });

        //Montage du composant Chargement des données
        //Liste contiendra le résultat de la requête
        let liste = ref()
        let total = ref()
        total.value = 0

        onMounted(async() => {
            //let request = "https://accidentvelo.jmfino.fr/json.php"
            let request = "accidents-velos.json"
            await fetch(request)
            //Réponse demandée en json
            .then(response => response.json())
            //Récupération de la réponse
            .then(response => {
                liste.value = response
        console.log("liste", liste)
        console.log("nb lignes", liste.value.length)
                byYear()
                })
                .catch(error => console.log('erreur Ajax', error))

        })
        
        const byYear = () => {
            //Recupération des années (set)
            let setAnnee = new Set()
            let firstLine = true;
            liste.value.forEach( (el) => {
                if(!firstLine){
                    let dt = el[1].split('-') //Recupération de l'année à partir de la date
                    setAnnee.add(dt[0]) //Ajout année au set
                }
                firstLine = false
            })
            //Chargement des labels
            chartData.labels = Array.from(setAnnee)
            chartData.labels.sort() //Tri des années


            let cptBG = [] //Tableau de comptage blessés graves
            let cptBL = [] //Tableau de comptage blessés légers
            let cptT = [] //Tableau de comptage tués
            let cptI = [] //Tableau comptage indemne
            //Boucle pour comptage
            firstLine = true;
            total.value = 0 //totalisation des mvts
            chartData.labels.forEach( (an) => {
                let nbBG = 0 // compteur blessés graves
                let nbBL = 0 // compteur blessés légers
                let nbT = 0 //compteur blessés tués
                let nbI = 0 //compteur indemne
                liste.value.forEach((el) => { //boucle de comptage
                    if(!firstLine){
                        let dt = el[1].split('-')
                        if(an ==dt[0]){
                            if(el[22] == '2 - Blessé hospitalisé') {nbBG++}
                            if(el[22] == '1 - Blessé léger') {nbBL++}
                            if(el[22] == '0 - Indemne') {nbI++}
                            if(el[22] == '3 - Tué') {nbT++}
                        }
                    }
                    firstLine = false
                    
                })
                cptBG.push(nbBG) //Ajout total blessés graves au tableau
                cptBL.push(nbBL) //Ajout total blessés légers au tableau
                cptT.push(nbT) //Ajout total tués au tableau
                cptI.push(nbI) //AJout total indemne au tableau
            })
            chartData.datasets[0].data = cptBG //Chargement données blessés grave
            chartData.datasets[1].data = cptBL //Chargement données blessés legers
            chartData.datasets[2].data = cptT //Chargement données tués
            chartData.datasets[3].data = cptI // Chargement données indemne
        
       }
    

        
</script>

<template>
    <div class="container">
        <Line
            :chart-options="chartOptions"
            :chart-data="chartData"
            :chart-id="chartId"
            :dataset-id-key="datasetIdKey"
            :plugins="plugins"
            :css-classes="cssClasses"
            :styles="styles"
            :witdh="width"
            :height="height"
        />
    </div>
</template>