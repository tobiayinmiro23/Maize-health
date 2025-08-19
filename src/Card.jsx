import React, { useEffect, useState } from 'react'

const Card = ({ pestData }) => {
    const [recommendedPesticide, setrecommendedPesticide] = useState([])
    const [detectedPest, setdetectedPest] = useState('')
    const [healthy, sethealthy] = useState(false)
    const [message, setmessage] = useState('')
    let blight = ["Proline", "Sphere Max", "Quilt", "Priaxor", "Dithane", "Prothioconazole", "Manzate","Azoxystrobin", "Pyraclostrobin", "Trifloxystrobin", "Propiconazole", "Tebuconazole", "Cyproconazole", "Flutriafol", "Mancozeb", "Chlorothalonil", "Zineb"]
    //["Proline", "Sphere Max", "Quilt", "Priaxor", "Dithane", "Prothioconazole", "Tebuconazole", "Manzate", "Azoxystrobin", "Pyraclostrobin"];
    let grey_leaf_spot = ["Sercadis", "Solatenol", "Amistar", "Priaxor", "Echo", "Prothioconazole", "Difenoconazole", "Tebuconazole", "Trifloxystrobin", "Azoxystrobin"];
    let common_rust = ["Folicur", "Tebuzol", "Orius", "Tilt", "Bumper", "Score", "Divident", "Rally", "Amistar", "Heritage", "Headline", "Flint", "Opera", "Tebuconazole", "Propiconazole", "Difenoconazole"];

    useEffect(() => {
        if (pestData?.predicted_classes.length === 0) setmessage('No pest detected, or pest not known by the model')
        else if (pestData?.predicted_classes[0] === 'Blight') {
            setdetectedPest('Blight')
            setrecommendedPesticide(blight)
        }
        else if (pestData?.predicted_classes[0] === 'Common_Rust') {
            setdetectedPest('Common_Rust')
            setrecommendedPesticide(common_rust)
        }
        else if (pestData?.predicted_classes[0] === 'Gray_Leaf_Spot') {
            setdetectedPest('Gray_Leaf_Spot')
            setrecommendedPesticide(grey_leaf_spot)
        }
        else if (pestData?.predicted_classes[0] === 'Healthy') sethealthy(true)
        else setmessage('an error occured, please try again later')

    }, [])
    console.log(detectedPest)
    return (
        <div className='card'>
            {
                (detectedPest !== '' || undefined) &&
                <div className='card_header'>
                    <h2>Detected Pest: </h2>
                    <i className='pest_name'>{detectedPest}</i>
                </div>
            }
            <div>
                {
                    recommendedPesticide.length !== 0 &&
                    <div>
                        <h2>Recommended Pesticides</h2>
                        {
                            recommendedPesticide?.map(item => {
                                return <i key={item}>{item}</i>
                            })
                        }
                    </div>
                }
            </div>
            <i>{message}</i>
            {healthy && <i>No Pest detected maize is healthy</i>}
        </div>
    )
}


export default Card
