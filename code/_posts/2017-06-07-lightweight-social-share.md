---
layout: post
title: lightweight-social-share
category: code
heading: Lightweight Social Share Options
description: A very lightweight way to add social sharing functionality to your site.

---


I recently read [this](https://philipwalton.com/articles/stop-copying-social-code-snippets/) article by Philip Walton. It encourages web developers to take control of the code they use to implement sharing via social networks like Facebook or Twitter. 

## The Problem

Most of the 'black-box' solutions that the social giants provide on their developer sections have the following features according to Philip.

> Almost every social snippet out there does the same two things:
> 
> 1. It adds a placeholder element to the HTML.
> 2. It loads a script from their site that adds some stuff to the placeholder.

Most of this code is redundant in the use-case of the average blog or static site and, in many cases, slows down the loading of yout page. 

## The solution. 

The [article](https://philipwalton.com/articles/stop-copying-social-code-snippets/) demonstrates that a better approach might be to load the scripts after the page finishes loading.

While this is a perfectly good way to do things, I wondered if there might be a way to cut things down even more. Here's what I came up with. 

When you click a share button, a new window pops up with everything that you need to share stuff on a particular website. Getting a script from a website for something a hyperlink can do seems a bit overkill to me. So lets try doing this with hyperlinks.

### Twitter

After a few Google searches, I found that Twitter has something called [Web Intent](https://dev.twitter.com/web/tweet-button/web-intent) that lets you use a link to tweet about a page. In their own words:

>A Tweet Web Intent makes it easy for your site visitors to compose and post a Tweet to their audience from a link or child window of your webpage. Publishers may pre-populate Tweet text and hashtags, pass a URL, and identify Twitter accounts related to the page.

So that shouldn't be too hard. The page describes the various options that allow you to pre-fill some text into the tweet, pass in a URL to link to, add hashtags and add your own twitter username to the tweet. The link looks something like
{% highlight html %}
	https://twitter.com/intent/tweet?text=TEXT&url=URL
{% endhighlight %}
Here, `TEXT` and `URL` are [URL-Encoded](http://en.wikipedia.org/wiki/Percent-encoding), which means all characters that aren't normally allowed in URLs are escaped using %-encoded characters. Although, for `TEXT`, whitespaces can be replaced with + as well. 
Since my site is built using Jekyll, I used the liquid string filter `url_encode`. Documentation is [here](https://help.shopify.com/themes/liquid/filters/string-filters#url_encode).

### Facebook

Facebook was a bit more difficult. Facebook used to have a method to share via URLs using a file called `sharer.php`, but it appears to be deprecated. The [documentation](https://developers.facebook.com/docs/sharing/reference/share-dialog) now encourages to use the share dialog. But I didn't want to do this since it requires creating an app. 

The `sharer.php` method still works. So I decided to go with that. The link is
{% highlight html %}
	https://www.facebook.com/sharer/sharer.php?u=URL
{% endhighlight %}
This time `URL` doesn't need to be URL-Encoded. And that's it! This will open up the share dialog. Although I haven't found any information as to how long this method will be supported.

Alternatively, you can use the share dialog as described by facebook. This means you'll have to sign into facebook for developers and then create an empty app to get the `app-id`.

![Creating an app]({{site.staticfiles | prepend: site.baseurl }}/img/posts/{{ page.category }}/{{ page.title }}/create.png)

Once you've entered all the details, you'll get to the app settings where you can find the `app_id`.

![Getting app_id]({{site.staticfiles | prepend: site.baseurl }}/img/posts/{{ page.category }}/{{ page.title }}/app_id.png)

Once that's done we're ready to create the share URL. This time we'll use
{% highlight html %}
	https://www.facebook.com/dialog/share?app_id=APP_ID&href=URL
{% endhighlight %}
The example shows `URL` to be %-encoded. There are also options for hashtags specified in the docs. 

### Hyperlinks yay!

Creating the hyperlinks themselves is fairly straightforward. Create something like
{% highlight html %}
	<a class="share" href="https://www.facebook.com/dialog/share?app_id=APP_ID&href=URL">Share on Facebook</a>
	<a class="share" href="https://twitter.com/intent/tweet?text=TEXT&url=URL"Tweet about this</a>
{% endhighlight %}
Notice a few things here. I've used share dialogs for Facebook but as of the present the `sharer.php` code also works. I've also given a class of `share` to both. We will need them later for the pop-up.  Feel free to add any container `<div>`s or `<span>`s and style according to your wish.

Onto the popup now!

### jQuery Popup

I'm a huge fan of jQuery. It makes writing effective JS code very simple and is very widely used. So it makes sense to use JS to open a popup window. If you're unfamiliar with jQuery, check it out [here](https://jquery.com/). After you've included jQuery either using a CDN or by serving it locally, add the following fragment of code. 
{% highlight javascript %}
	$('.share').click(function (event) {
	    event.preventDefault();
	    window.open(
	    	$(this).attr("href"),
	     	"popupWindow",
	     	"width=600,height=600,scrollbars=yes"
	     	);
	});
{% endhighlight %}
Here, we're using the `.share` class to bind the `click` event handler to. So when something with a class `share`, we open a window that leads to it's `href` attribute. The window size is 600x600 with scrollbars in case you need them. 

![Pop-up]({{site.staticfiles | prepend: site.baseurl }}/img/posts/{{ page.category }}/{{ page.title }}/popup.png)

And that's all, folks! Once you click the link, a small pop-up window appears letting you share via Twitter or Facebook.