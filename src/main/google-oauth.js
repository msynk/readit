const { parse } = require('url')
const qs = require('qs')
const { BrowserWindow } = require('electron')
const fetch = require('node-fetch')

const GOOGLE_CLIENT_ID = '48489757182-1cg50og3b5dv8e6t9j8v2uo738056g7p.apps.googleusercontent.com'
const GOOGLE_REDIRECT_URI = 'com.msynk.readit:/oauth2redirect&'

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_PROFILE_URL = 'https://www.googleapis.com/userinfo/v2/me'
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token'

module.exports = async function googleSignIn() {
    const code = await signInWithPopup()
    console.log(code)
    const tokens = await fetchAccessTokens(code)
    console.log(tokens)
    return tokens
    //const { id, email, name } = await fetchGoogleProfile(tokens.access_token)
    // const providerUser = {
    //     id,
    //     email,
    //     name,
    //     tokens
    // }

    // return providerUser
}

function signInWithPopup() {
    return new Promise((resolve, reject) => {
        const authWindow = new BrowserWindow({
            width: 500,
            height: 600,
            show: true,
        })

        // TODO: Generate and validate PKCE code_challenge value
        const urlParams = {
            response_type: 'code',
            redirect_uri: GOOGLE_REDIRECT_URI,
            client_id: GOOGLE_CLIENT_ID,
            scope: 'profile email',
        }
        const authUrl = `${GOOGLE_AUTHORIZATION_URL}?${qs.stringify(urlParams)}`

        authWindow.on('closed', () => {
            // TODO: Handle this smoothly
            //throw new Error('Auth window was closed by user')
            console.error('Auth window was closed by user')
        })

        authWindow.webContents.on('will-navigate', (event, url) => {
            handleNavigation(url, event)
        })

        authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
            handleNavigation(newUrl, event)
        })

        authWindow.loadURL(authUrl, { userAgent: 'Chrome' })

        function handleNavigation(url, event) {
            const query = parse(url, true).query
            if (query) {
                if (query.error) {
                    reject(new Error(`There was an error: ${query.error}`))
                } else if (query.code) {
                    event.preventDefault()
                    // Login is complete
                    authWindow.removeAllListeners('closed')
                    setImmediate(() => authWindow.close())

                    // This is the authorization code we need to request tokens
                    resolve(query.code)
                }
            }
        }
    })
}



async function fetchAccessTokens(code) {
    const q = qs.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
    })
    const response = await fetch(`${GOOGLE_TOKEN_URL}?${q}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    return response.json()
}

async function fetchGoogleProfile(accessToken) {
    const response = await fetch(GOOGLE_PROFILE_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    return response.json()
}