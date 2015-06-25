import Reflux from 'reflux';
import themeActions from '../actions/theme';
import Parser from '../api/parser';

var themeStore = Reflux.createStore({
    listenables: [themeActions],
    data: {
      filePath: null,
      saturatePercentage: 0,
      showOptions: false,
      themeContentDefault: null,  /* default theme content */
      themeContentNew: null, /* new generated theme content */
      colors: [] /* array of colors */
    },
    onUploadTheme(filePath) {
      this.data.showOptions = true;      
      let themeContent = fs.readFileSync(filePath, "utf8");       
      this.data.filePath = filePath;
      this.data.themeContent = themeContent;      
      this._updateTheme();      
    },
    onSaveTheme(filePath) {      
      let newFilePath = path.dirname(process.execPath) + '/out/' + this.data.filePath.replace(/^.*[\\\/]/, '');      
      fs.writeFile(newFilePath, this.data.themeContentNew);      
    },    
    _updateTheme() {
      let generate = Parser.generate(this.data.themeContent, this.data.saturatePercentage);
      this.data.themeContentNew = generate.newThemeContent;
      this.data.colors = generate.colors;
      this.trigger(this.data);       
    },
    onSetSaturate(value) {      
      this.data.saturatePercentage = value;              
      this.trigger(this.data);
      this._updateTheme();
    },
    getInitialState() {
      return this.data;
    }
});

export default themeStore;