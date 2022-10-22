<script setup>
    //import des éléments utiles de vue
    import {ref, reactive, onMounted} from 'vue'

    //import d'un graphique Doughnut
    import {Doughnut} from 'vue-chartjs'

    //import des objets du graphique depuis la bibliothèque chartjs
    import {Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale} from 'chart.js'

    //Elements utilisés potentiellement pour notre graphique
    ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

    //Propriétés du graphique utilisés dans le template (porps)
    // On définit pour chacune son type de données et sa valeur par défaut 
    // On peut utiliser une grande variété de types, voire des objets
    const propChart = defineProps({
        chartId: {type: String, default: 'doughnut-chart'}, //Id graphique
        datasetIdkey: {type: String, default: 'label'}, //id du dataSet
        width: {type: Number, default: 500}, //largeur du graphique
        height: {type: Number, default: 500}, //hauteur du grpahique
        cssClasses: {type: String, default: ''}, //Classe css utilisées
        styles : {type: Object, default: () => {}} //plugins utilisés
    })

    //Données du graphe
        //Pour l'instant juste pour tester le fonctionnement
        const chartData = reactive({
            //labels 
            labels: [],
            datasets : [{}]
        })

        //Options du graphe
        const chartOptions = reactive ({
            responsive: true, 
            maintainAspectRatio: false
        })

        //Utilisation d'une ref pour requête Ajax
        // null au départ (important)
        let liste = ref(null);
        //Liste des oui non
        let lstOuiNon = [];
        //table nb de villageois par spécialité
        let lstNb = [];
        //Au montage du composant
        onMounted(async() => {
             let request = "https://accidentvelo.jmfino.fr/json.php"
            await fetch(request)
            //Réponse demandée en json
            .then(response => response.json())
            //Récupération de la réponse
            .then(response => {
                liste.value = response
            console.log("liste", liste)
                })
                .catch(error => console.log('erreur Ajax', error))

                //Parcour de la liste des villageois
                //Pour placer les spécialités dans un set
                //Permet d'éliminer les doublons
                /*let setOuiNon = new Set();
                liste.value.forEach( (ac) => {
                    if(!firstLine){setOuiNon.add(ac[36])}
                    firstLine = false
                })
                chartData.labels = Array.from(setOuiNon)*/
                chartData.labels=["En agglomération", "Hors agglomération"]
                let firstLine = true;


                
                //Recupération des valeurs de set dans un tableau
                //chartData.labels = Array.from(setOuiNon);
                //Tri du tableau par ordre alphabétique
               // chartData.labels.sort();
                console.log("tri libellé : ", chartData.labels)

                let cptOui = [];
                let cptNon = [];
                firstLine = true;
                let nbOui = 0
                let nbNon = 0
                //Parcours des specialités 
                chartData.labels.forEach(function(ch){
                    //Initialisation du nombre pour le spécialité en cours
                    
                    //Parcours de la liste des villageois
                    liste.value.forEach( (val) => {
                        //Si c'est la bonne spécialité
                        //on compte +1
                        if(!firstLine){
                            if(val[36] == '1') {nbOui++}
                            if (val[36] == '') {nbNon++}
                        }
                    
                    })
                    //on place le nb de villageois de cette spécialité dans le tableau de comptage
                    
                    firstLine = false //Mise ç faux de la 1° ligne
                })
                cptOui.push(nbOui);
                cptOui.push(nbNon);
                //on transfert le tableau de comptage dans les data
                chartData.datasets[0].data = cptOui;
                console.log("chartdata, " , chartData.datasets[0])

                //Calcul des couleurs et bordures
                let bgColor=[];
                    let bdColor = [];
                    //Pour chaque valeur existante
                    cptOui.forEach( function(val){
                        //On calcul la couleur du secteur
                        let c1 = couleur(0, 255)
                        let c2 = couleur(0,255)
                        let c3 = couleur(0, 255)
                        let tr = 0.5
                        //Couleur avec transparence
                        let color = 'rgba(' + [c1, c2, c3, tr].join(',') +")"
                        bgColor.push(color)
                    })
                    //Chargement des couleurs et des bordures
                    chartData.datasets[0].backgroundColor = bgColor;
                    chartData.datasets[0].borderColor = bdColor;
                    //chartData.datasets[1].backgroundColor = bgColor;
                    //chartData.datasets[1].borderColor = bdColor;
           

        //Fonction de calcul aléatoire des couleurs
        
        })
        const couleur = (min, max) => {
            return Math.floor(Math.random() * (max - min));
        }

                
</script>

<template>

    <div class="container">
        <!--
            chart-otpions : Options du graphique
            chart-data : données du graphique
            chart-id : Identifiant du graphique
            dataset-id-key : Identifiant des données
            plugins : plugins utilisés
            css-classes : Classes css utilisées
            styles : styles css utilisés
            witdh : largeur du graphique
            height : hauteur du graphique
        -->
        <Doughnut
            :chart-otpions="chartOptions"
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