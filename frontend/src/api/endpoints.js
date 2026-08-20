const endPoints={
    LOGIN:{
        url:'/auth/login',
        auth:false
    },
    REGISTER:{
        url:'/auth/register',
        auth:false
    },
    GET_NOTES:{
        url:'/notes/get-notes',
        auth:true
    },
    ADD_NOTE:{
        url:'/notes/add-note',
        auth:true
    },
    UPDATE_NOTE:{
        url:'/notes/update-note',
        auth:true
    },
    DELETE_NOTE:{
        url:'/notes',
        auth:true
    },
    ASK_QUERY:{
        url:'/ask/query',
        auth:true
    }
}

export default endPoints;