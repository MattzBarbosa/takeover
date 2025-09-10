        $(document).ready(function() {
            const emailProviders = ["@gmail.com", "@outlook.com", "@hotmail.com", "@yahoo.com", "@icloud.com"];
            const $input = $("#email");
            const $suggestions = $("<div id='emailSuggestions' class='suggestions'></div>").insertAfter($input.parent());

            $input.on("input", function() {
                const value = $input.val();
                const atIndex = value.indexOf("@");

                if (atIndex > 0) { // Somente exibir se o usuário digitou '@'
                    const query = value.slice(atIndex);
                    const matches = emailProviders.filter(provider => provider.startsWith(query));

                    if (matches.length > 0) {
                        $suggestions.html(matches.map(match => `<div class="suggestion-item">${value.split("@")[0]}${match}</div>`).join(""));
                        $suggestions.css({
                            display: "block",
                            position: "absolute",
                            top: $input.position().top + $input.outerHeight(),
                            left: $input.position().left,
                            width: $input.outerWidth()
                        });
                    } else {
                        $suggestions.hide();
                    }
                } else {
                    $suggestions.hide();
                }
            });

            $suggestions.on("click", ".suggestion-item", function() {
                $input.val($(this).text());
                $suggestions.hide();
            });

            $(document).on("click", function(e) {
                if (!$(e.target).closest("#email, #emailSuggestions").length) {
                    $suggestions.hide();
                }
            });
        });