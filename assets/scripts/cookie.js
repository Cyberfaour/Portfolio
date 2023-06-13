document.addEventListener('DOMContentLoaded', function() {
    var acceptButton = document.getElementById('acceptButton');
    var rejectButton = document.getElementById('rejectButton');
  
    acceptButton.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default form submission
      acceptCookies();
    });
  
    rejectButton.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default form submission
      rejectCookies();
    });
  
    function acceptCookies() {
      createCookie('cookieConsent', 'true', 365); // Create a cookie named 'cookieConsent' with the value 'true' that expires in 365 days
      hideCookieBanner();
    }
  
    function rejectCookies() {
      createCookie('cookieConsent', 'false', 365); // Create a cookie named 'cookieConsent' with the value 'false' that expires in 365 days
      hideCookieBanner();
    }
  
    function createCookie(name, value, days) {
      var expires = '';
  
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
      }
  
      var cookieString = name + '=' + value + expires + '; path=/';
  
      // Set the Secure attribute if the page is served over HTTPS
      if (window.location.protocol === 'https:') {
        cookieString += '; Secure';
      }
  
      document.cookie = cookieString;
    }
  
    function hideCookieBanner() {
        var banner = document.getElementById('cookieBanner');
        banner.classList.add('hide');
        setTimeout(function() {
          banner.style.display = 'none';
        }, 500);
    }
         // Hide the banner after the transition duration (500ms)    }
  
    var cookieConsent = document.cookie
      .split('; ')
      .find(row => row.startsWith('cookieConsent='))
      ?.split('=')[1];
  
    if (cookieConsent === 'true') {
      hideCookieBanner();
    } else {
      document.getElementById('cookieBanner').style.display = 'block';
    }
  });
  