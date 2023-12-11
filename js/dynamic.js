//put the update in an animation frame loop
let lastCursorPosition = 0
let lastSession = null
let scrolled = false
document.addEventListener("scroll",() => {
    d3.select('#cursor').attr('style', `top:${lastCursorPosition}px;`)
})
function updateCursor(currentSession,currentProgress) {
    let cursor = d3.select('#cursor')
    //update the cursor if the session changes
    if (lastSession == null || lastSession.index != currentSession.index) {
        cursor.html(marked.parse(currentSession.text))
        lastSession = currentSession
        document.getElementById('menu').childNodes.forEach(childNode => {childNode.classList.remove('active')})
        let currentNav = document.getElementById('menu').childNodes[currentSession.index]
        if (currentNav!= null) currentNav.classList.add('active')
    }
    //update the cursor dimension and the position according to the scrolling progress of the session
    let cursorDimensions = cursor.node().getBoundingClientRect()
    let cursorPosition = ((window.scrollY + window.innerHeight) - (currentProgress * window.innerHeight))-(currentProgress * cursorDimensions.height)
    let cursorPositionRelative = (window.innerHeight - (currentProgress * window.innerHeight))-(currentProgress * cursorDimensions.height)
    cursor.attr('style', `top:${cursorPositionRelative}px;`)
    lastCursorPosition = cursorPositionRelative
    updateLinks(currentSession,cursorPosition,cursorDimensions)
}


function animation(){
    if(!scrolled && sessions.length > 0){
        hashChange()
        scrolled = true
    }
    //calculate the current session and the progress in the session
    update()
    //loop the animation frame
    requestAnimationFrame(() => {animation()})
}
function update(){
    let currentSession = sessions.filter(session => session.margin <= window.scrollY && window.scrollY <= (session.margin + session.height))[0]
    if (typeof currentSession == "undefined") return;
    let currentProgress = (window.scrollY - currentSession.margin)/currentSession.height
    if(currentSession.index == 0){
        currentProgress = ((window.scrollY+currentSession.height/2)-(currentProgress * currentSession.height/2) - currentSession.margin)/currentSession.height
    }
    //update the cursor
    updateCursor(currentSession,currentProgress)
}
let menuState = false;
function toggleMenu(){
    menuState = !menuState
    if(menuState){
        document.getElementById('menu').classList.add('active')
    }else{
        document.getElementById('menu').classList.remove('active')
    }
}
window.onhashchange = () => {hashChange()}
function hashChange(){
    if(sessions.length > 0){
        if (window.location.hash == ""){
            window.scrollTo({top: 0,behavior: 'smooth' })
            return;
        }
        let session = sessions.filter(session => session.hash == window.location.hash.substring(1))[0]
        if(typeof session != "undefined"){
            window.scrollTo({top: session.index == 0 ? 0 :session.margin + (session.height/2), behavior: 'smooth' })
        }
    }
}