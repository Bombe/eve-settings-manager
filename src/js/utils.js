const { ipcRenderer } = require('electron')
const $ = require('jquery')
const AppConfig = require('../configuration')
const { changeLanguage } = require('./change-language')
const { changeServer, getServerStatus } = require('./eve-server')
const { openFolder, readDefaultFolders, setSelectedFolder, readSettingFiles } = require('./eve-folder')

const languageSelect = $('#language-select')
const serverSelect = $('#server-select')
const folderSelect = $('#folder-select')
const selectFolderButton = $('#select-folder-btn')
const openFolderButton = $('#open-folder-btn')
const editCharDescriptionButton = $('#edit-char-description-btn')

function init() {
  initSelects()
  bindEvents()
}

async function initSelects() {
  let language = AppConfig.readSettings('language')
  if (!language) {
    AppConfig.saveSettings('language', 'zh-CN')
    language = 'zh-CN'
  }
  languageSelect.val(language)
  changeLanguage(language)

  let server = AppConfig.readSettings('server')
  if (!server) {
    AppConfig.saveSettings('server', 'tranquility')
    server = 'tranquility'
  }
  serverSelect.val(server)
  changeServer(server)

  readDefaultFolders()

  await new Promise(r => setTimeout(r, 500));

  readSettingFiles()
}

function bindEvents() {
  languageSelect.on('change', () => {
    const selectedLang = languageSelect.val()
    AppConfig.saveSettings('language', selectedLang)
    changeLanguage(selectedLang)
  })

  serverSelect.on('change', () => {
    const selectedServer = serverSelect.val()
    AppConfig.saveSettings('server', selectedServer)
    changeServer(selectedServer)
    readDefaultFolders()
    getServerStatus()
  })

  folderSelect.on('change', () => {
    const selectedFolder = folderSelect.val()
    const server = serverSelect.val()
    AppConfig.saveSettings('savedFolder.' + server, selectedFolder)
    readSettingFiles()
  })

  selectFolderButton.on('click', async (e) => {
    e.preventDefault()
    const folderPath = await window.electronAPI.openFolderDialog()
    setSelectedFolder(folderPath)
  })

  openFolderButton.on('click', (e) => {
    e.preventDefault()
    openFolder()
  })

  editCharDescriptionButton.on('click', (e) => {
    e.preventDefault()
    window.electronAPI.openDescriptionDialog(1, 2)
  })
}

module.exports = {
  init,
}
