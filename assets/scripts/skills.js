$(document).ready(function() {
    var skills = [
      "Computer Engineering",
      "├ Programming Languages",
      "│   ├ Java",
      "│   ├ C/C++",
      "│   ├ C#",
      "│   ├ Python",
      "│   ├ JavaScript",
      "│   └ Assembly",
      "├ Web Development",
      "│   ├ HTML",
      "│   ├ CSS",
      "│   ├ PHP",
      "│   ├ SCSS/Bootstrap",
      "│   ├ React",
      "│   ├ Node.js",
      "│   ├ Express.js",
      "│   └ MongoDb/MySql",
      "├ Operating Systems",
      "│   ├ Unix Scripting",
      "│   ├ Ubuntu",
      "│   ├ Debian",
      "│   ├ Kali Linux",
      "│   └ Windows 7/10",
      "├ Frameworks",
      "│   ├ ASP.NET MVC",
      "│   ├ AWS",
      "│   ├ Azure",
      "│   ├ Azure Bot Framework",
      "│   ├ Entity Framework",
      "│   └ Identity Framework",
      "├ Data Science",
      "│   ├ R/Python",
      "│   ├ Pandas",
      "│   ├ Matplotlib",
      "│   ├ Mathematics",
      "│   ├ NumPy",
      "│   └ Excel",
      "├ Software Engineering",
      "│   ├ SOLID",
      "│   ├ JUNIT/TDD",
      "│   ├ Design",
      "│   ├ Docker",
      "│   ├ Git",
      "│   └ Virtualization",
      "└ Tools",
      "    ├ Microsoft 365",
      "    ├ LTspice",
      "    ├ LabView",
      "    ├ ATmel Studio",
      "    ├ Visual Studio Code",
      "    └ Packet Tracer"
    ];
  
    // Function to split the skills into columns
    function splitSkillsIntoColumns() {
      var columns = $(".column");
      var skillsPerColumn = Math.ceil(skills.length / columns.length);
  
      for (var i = 0; i < columns.length; i++) {
        var startIndex = i * skillsPerColumn;
        var endIndex = startIndex + skillsPerColumn;
        var columnSkills = skills.slice(startIndex, endIndex);
  
        columns.eq(i).empty();
        columnSkills.forEach(function(skill, index) {
          // Increase font size for parent and first child elements
          if (index === 0) {
            columns.eq(i).append("<li class='parent'>" + skill + "</li>");
          } else {
            columns.eq(i).append("<li class='child'>" + skill + "</li>");
          }
        });
      }
    }
  
    // Trigger the column layout on page load and window resize
    $(window).on("load resize", splitSkillsIntoColumns);
  });
  