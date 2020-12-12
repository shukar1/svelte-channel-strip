<script>
  export let obj;
  export let keys = null;
  let preElement = null;
  $: if (obj && preElement) {
    preElement.innerHTML = syntaxHighlight(JSON.stringify(obj, keys, 2));
  }

  function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }


</script>


<pre bind:this={preElement}></pre>

<style>
    pre {
        outline: 1px solid #ccc;
        padding: 5px;
        margin: 5px;
    }

    /*pre > :global(.string) {*/
    /*    color: green;*/
    /*}*/

    /*    :global(.number) {*/
    /*        color: darkorange;*/
    /*    }*/

    /*    :global(.boolean) {*/
    /*        color: blue;*/
    /*    }*/

    /*    :global(.null) {*/
    /*        color: magenta;*/
    /*    }*/

    /*    :global(.key) {*/
    /*        color: red;*/
    /*    }*/
    /*}*/


</style>
