import {useEffect, useState} from "react";

const specifyTitle = {
  'leads': 'Leads & Clients',
  'chats/opportunities': 'Opportunities Chat',
  'chats/leads': 'Leads Chat',
  'chats/clients': 'Clients Chat',
  'chats/network': 'Networks Chat',
  'documents': 'Documents',
  'documents/templates': 'Documents Templates',
  'overview/matters': 'Matters',
  'overview/invoices': 'Invoices'
}

const toTitleCase = (phrase, withDash?: boolean): string => {
  if (!phrase) return phrase;

  return phrase
    .toLowerCase()
    .split(withDash ? "-" : " ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const useDocumentTitle = () => {
  const [pathname, setPathname] = useState("/")

  useEffect(() => {
    setPathname(document.location.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    updateTitle(pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  function checkSpecifyTitle(url: string[] | string) {
    const title = specifyTitle?.[url[2]];
    const complexTitle = specifyTitle[`${url[2]}/${url[3]}`];

    if (url.length > 3 && complexTitle) {
      return complexTitle
    }
    if (title) {
      return title;
    }
    return url[2]
  }

  function updateTitle(pathname: any) {
    document.title = `JustMediation`;
    const urlParsed = pathname!.split("/").filter(k => k !== "");

    if (pathname && pathname.length > 2) {
      let title: string[] | string = pathname.split("/");
      title = title.length > 2 ? checkSpecifyTitle(title) : '';
      title = toTitleCase(title);
      document.title = `JustMediation - ${title}`
    }

    if(urlParsed.length === 1) {
      document.title = `JustMediation - ${toTitleCase(urlParsed[0], true)}`
    }
  }

  useEffect(() => {
    document.body.addEventListener('click', () => {
      requestAnimationFrame(() => {
        if (pathname !== document.location.pathname) {
          setPathname(document.location.pathname);
        }
      });
    })
  }, [pathname])
};

export default useDocumentTitle;