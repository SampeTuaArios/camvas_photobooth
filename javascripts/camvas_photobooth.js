var FM = {
  pixLum: function(r,g,b) {
    return r*0.34 + g*0.5 + b*0.16
  },
  apply: function(canvas, outputCtx, hiddenCtx, filter) {
    if (!filter) {
      outputCtx.drawImage(canvas, 0, 0)
      return
    }
    var imageData = hiddenCtx.getImageData(0, 0, canvas.width, canvas.height)
    var pixels = imageData.data
    for (var i = 0, filtered = [0,0,0], n = pixels.length; i <= n; i += 4) {
      if (filtered[0] == pixels[i] && filtered[1] == pixels[i+1] && filtered[2]== pixels[i+2])
        continue
      filtered = FM[filter](pixels[i], pixels[i+1], pixels[i+2])
      pixels[i] = filtered[0]
      pixels[i+1] = filtered[1]
      pixels[i+2] = filtered[2] 
    }
    imageData.data = pixels
    outputCtx.putImageData(imageData, 0, 0)
  },
  cheapGreyScale: function(r,g,b) {
    var pixAvg = (r+g+b) / 3
    return [pixAvg, pixAvg, pixAvg]
  },
  niceGreyScale: function(r,g,b) {
    var pixLum = r*0.34 + g*0.5 + b*0.16
    return [pixLum, pixLum, pixLum]
  },
  invert: function(r,g,b) {
    return [255 - r, 255 - b, 255 - g]
  },
  cheapVignette: function(r,g,b) {
    if (FM.pixLum(r,g,b) < 50)
      return [0,0,0]
    else
      return [r,g,b]
  },
  nouvelleVagueBillboard: function(r,g,b) {
    var pixLum = FM.pixLum(r,g,b)
    if (pixLum < 50)
      return [0,0,0]
    if (pixLum < 100)
      return [80, 80, 80]
    if (pixLum < 150)
      return [130, 130, 130]
    if (pixLum < 200)
      return [180, 180, 180]
    else
      return [240, 240, 240]
  },
  bloodBath: function(r,g,b) {
    var pixLum = FM.pixLum(r,g,b)
    if (pixLum < 80)
      return [r+40, 0, 0]
    return [r+40,pixLum-5,pixLum-5]
  }
}

var takePicture = function() {
  $('#output-canvas').animate({opacity: 0}, 200, function() {
    $('#output-canvas').animate({opacity: 100})
  })
  var url = $('#output-canvas')[0].toDataURL()
  $('#pictures').prepend($('<a href="'+url+'"><img src="'+url+'"></a>'))
  $('#pictures').css('width', 148*$('#pictures img').length)
}

window.onload = function(){
  var canvas = document.getElementById('process-canvas')
  var outputCtx = document.getElementById('output-canvas').getContext('2d')
  var hiddenCtx = canvas.getContext('2d')
  var filter = null
  var draw = function(video, dt) {
    hiddenCtx.drawImage(video, 0, 0)
    var filteredImageData = FM.apply(canvas, outputCtx, hiddenCtx, filter)
  }
  var myCamvas = new camvas(outputCtx, draw)
  $('input[name="filter"]').change(function(){
    console.log('bubu')
    filter = $('input[name="filter"]:checked').val()
  })
  $('#trigger').click(function(){takePicture()})
}
