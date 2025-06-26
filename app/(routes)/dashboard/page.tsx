import React from 'react'
// import Banner from './_components/Banner'
import Banner from './_components/Banner'
// import History from './_components/History'
import History from './_components/History'

import AiTools from './_components/AiTools'


function Dashboard() {
    return (
        <div className='-mt-5'>
            <Banner />
            <AiTools/>
            <History />
        </div>
    )
}

export default Dashboard