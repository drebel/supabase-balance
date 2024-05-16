import supabase from './supabase'

async function fetchDataForLast100(){

    const {user} = supabase.auth.user()

    try {
        const { data , error } = await supabase
            .from('balance_board_data')
            .select('*')
            .eq('user_id', user.id)
            .order('event_timestamp', { ascending: false})
            .limit(100)

        if(error){
            throw error
        }

        console.log("Data for last 100 rows", data)
        return data
    } catch (error) {
        console.error('Error fetching data', error)
    }
}

export default fetchDataForLast100