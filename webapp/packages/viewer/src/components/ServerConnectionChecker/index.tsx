import React, { useEffect, useState } from 'react';
import { useViewerLayoutContext } from '../../contexts/ViewerLayoutContext';
// import { delay } from '../../utils';
// import { api } from '@labelstack/api';
import Window from '../../ui/components/Window';

interface ServerConnectionCheckerProps {}

const ServerConnectionChecker: React.FC<ServerConnectionCheckerProps> = () => {
  const [, { showOverlayWindow, hideOverlayWindow }] = useViewerLayoutContext();
  const [lastCheckTime, setLastCheckTime] = useState<number>(0);
  const [blockingWindowVisible, setBlockingWindowVisible] = useState<boolean>(false);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       await api.checkBackendStatus();
  //       setBlockingWindowVisible(false);
  //     } catch (Error) {
  //       setBlockingWindowVisible(true);
  //     } finally {
  //       await delay(5000);
  //       setLastCheckTime(Date.now());
  //     }
  //   })();
  // }, [lastCheckTime]);

  useEffect(() => {
    if (blockingWindowVisible) {
      showOverlayWindow(
        <Window className={'w-1/4 h-1/4 place-self-center grid'}>
          <div className={'place-self-center text-3xl justify-center text-primary-light font-bold'}>
            Connection lost. <br />
            Reconnecting ...
          </div>
        </Window>
      );
    } else {
      hideOverlayWindow();
    }
  }, [blockingWindowVisible]);

  return <></>;
};

export default ServerConnectionChecker;
